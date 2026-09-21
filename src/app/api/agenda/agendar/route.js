import { after, NextResponse } from "next/server";
import { obterIpCliente, verificarLimite } from "@/lib/rateLimit";
import { criarDocumento } from "@/lib/firestoreRest";
import { eventosParaOcupados, horarioOcupado, validarHorario } from "@/lib/agenda";
import { agendaConfigurada, criarAgendamento, listarEventos } from "@/lib/googleAgenda";
import { whatsappParaEnvio } from "@/lib/contato";
import { obterContatos } from "@/lib/siteConfig";
import { enviarEmail, enviarWhatsApp } from "@/lib/notificacoes";
import { emailConfirmacao, whatsappAvisoOprtec, whatsappConfirmacao } from "@/lib/mensagensAgenda";

// Limites um pouco abaixo dos das regras do Firestore (200/200/30/150).
const LIMITES = { empresa: 190, nome: 190, whatsapp: 25, email: 150 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const IDIOMAS = ["pt", "en", "es"];
const TITULOS = {
  pt: "Avaliação gratuita OPRtec",
  en: "OPRtec free assessment",
  es: "Evaluación gratuita OPRtec",
};

// Versão da Política de Privacidade aceita no agendamento — muda junto com o texto dela.
const VERSAO_POLITICA = "2026-09-21.2";

const LIMITE_ENVIOS = 3;

export async function POST(request) {
  if (!agendaConfigurada()) {
    return NextResponse.json({ error: "agenda-indisponivel" }, { status: 503 });
  }

  const ip = obterIpCliente(request);
  const { permitido } = verificarLimite(`agendar:${ip}`, { limite: LIMITE_ENVIOS });
  if (!permitido) {
    return NextResponse.json({ error: "muitas-tentativas" }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "json-invalido" }, { status: 400 });
  }

  // Honeypot: mesmo esquema do /api/lead — responde 200 e não faz nada.
  if (String(body.site || "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const campos = {};
  for (const [campo, maximo] of Object.entries(LIMITES)) {
    const valor = String(body[campo] ?? "").trim();
    if (!valor) {
      return NextResponse.json({ error: "campos-obrigatorios" }, { status: 400 });
    }
    campos[campo] = valor.slice(0, maximo);
  }

  const telefone = whatsappParaEnvio(campos.whatsapp);
  if (!telefone) {
    return NextResponse.json({ error: "whatsapp-invalido" }, { status: 400 });
  }
  if (!EMAIL.test(campos.email)) {
    return NextResponse.json({ error: "email-invalido" }, { status: 400 });
  }
  if (body.aceitouPrivacidade !== true) {
    return NextResponse.json({ error: "aceite-obrigatorio" }, { status: 400 });
  }

  const idioma = IDIOMAS.includes(body.idioma) ? body.idioma : "pt";
  const horario = validarHorario(body.inicio);
  if (!horario) {
    return NextResponse.json({ error: "horario-indisponivel" }, { status: 409 });
  }

  // Confere de novo na agenda: alguém pode ter marcado o mesmo horário depois que a
  // página carregou, ou o horário pode ter sido bloqueado no gerencial.
  try {
    const eventos = await listarEventos(horario.inicio, horario.fim);
    if (horarioOcupado(horario, eventosParaOcupados(eventos))) {
      return NextResponse.json({ error: "horario-indisponivel" }, { status: 409 });
    }
  } catch (erro) {
    console.error("Falha ao consultar a agenda:", erro.message);
    return NextResponse.json({ error: "falha-na-agenda" }, { status: 502 });
  }

  // Grava primeiro o registro (é a prova do consentimento da LGPD e já serve de lead);
  // só depois cria o evento. Se a agenda falhar, o contato não se perde.
  try {
    await criarDocumento("agendamentos", {
      ...campos,
      inicio: new Date(horario.inicio),
      idioma,
      aceitouPrivacidade: true,
      versaoPolitica: VERSAO_POLITICA,
      origem: "site",
      criadoEm: new Date(),
    });
  } catch (erro) {
    console.error("Falha ao gravar agendamento:", erro);
    return NextResponse.json({ error: "falha-ao-gravar" }, { status: 502 });
  }

  let evento;
  try {
    evento = await criarAgendamento({
      inicio: horario.inicio,
      fim: horario.fim,
      titulo: `${TITULOS[idioma]} — ${campos.empresa}`,
      descricao: [
        `Empresa: ${campos.empresa}`,
        `Contato: ${campos.nome}`,
        `WhatsApp: ${campos.whatsapp}`,
        `E-mail: ${campos.email}`,
        "",
        "Agendado pelo site oprtec.com.br.",
      ].join("\n"),
      cliente: { ...campos, whatsapp: telefone, idioma },
    });
  } catch (erro) {
    console.error("Falha ao criar o evento na agenda:", erro.message);
    return NextResponse.json({ error: "falha-na-agenda" }, { status: 502 });
  }

  // Confirmações depois da resposta: o visitante não espera o WhatsApp nem o e-mail, e
  // uma falha neles não desfaz o agendamento (fica registrada no log).
  const inicioIso = horario.iso;
  after(async () => {
    const contatos = await obterContatos();
    const email = emailConfirmacao({ nome: campos.nome, inicio: inicioIso, meet: evento.meet, idioma });
    const envios = {
      "whatsapp-cliente": enviarWhatsApp(
        telefone,
        whatsappConfirmacao({
          nome: campos.nome,
          inicio: inicioIso,
          meet: evento.meet,
          idioma,
          whatsappOprtec: contatos.whatsappNumero,
        })
      ),
      "email-cliente": enviarEmail({
        para: campos.email,
        assunto: email.assunto,
        html: email.html,
        responderPara: contatos.email,
      }),
      "whatsapp-oprtec": enviarWhatsApp(
        contatos.whatsappNumero,
        whatsappAvisoOprtec({ ...campos, inicio: inicioIso, meet: evento.meet })
      ),
    };
    const nomes = Object.keys(envios);
    const resultados = await Promise.all(Object.values(envios));
    resultados.forEach((r, i) => {
      if (r.enviado) console.log(`[agenda] ${nomes[i]} enviado (evento ${evento.id}).`);
      else console.error(`[agenda] ${nomes[i]} NÃO enviado (evento ${evento.id}): ${r.motivo}`);
    });
  });

  return NextResponse.json({ ok: true, inicio: inicioIso, meet: evento.meet });
}
