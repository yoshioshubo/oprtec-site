import { TIPO_AGENDAMENTO, normalizarEvento } from "@/lib/agenda";
import { excluirEvento, obterEvento } from "@/lib/googleAgenda";
import { obterContatos } from "@/lib/siteConfig";
import { enviarEmail, enviarWhatsApp } from "@/lib/notificacoes";
import { emailCancelamento, whatsappCancelamento } from "@/lib/mensagensAgenda";
import { exigirAdmin, preflight, responder } from "@/lib/rotasAdmin";

export function OPTIONS() {
  return preflight();
}

// Cancela um agendamento feito pelo site: apaga o evento (o Google avisa o convidado) e
// manda o cancelamento por WhatsApp e e-mail com o link para escolher outro horário.
// Só aceita evento marcado como agendamento do site.
export async function DELETE(request) {
  const negado = await exigirAdmin(request);
  if (negado) return negado;

  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^[A-Za-z0-9_-]{1,1024}$/.test(id)) return responder({ error: "id-invalido" }, 400);

  let agendamento;
  try {
    const evento = await obterEvento(id);
    agendamento = normalizarEvento(evento);
    if (evento?.extendedProperties?.private?.oprtec !== TIPO_AGENDAMENTO) {
      return responder({ error: "nao-e-agendamento" }, 403);
    }
    await excluirEvento(id, { avisar: true });
  } catch (erro) {
    if (erro.status === 404 || erro.status === 410) return responder({ error: "nao-encontrado" }, 404);
    console.error("[agenda-admin] Falha ao cancelar:", erro.message);
    return responder({ error: "falha-na-agenda" }, 502);
  }

  // Evento já cancelado no Google antes (status "cancelled") não tem mais o que avisar.
  if (!agendamento) return responder({ ok: true, avisos: {} });

  const { nome = "", whatsapp = "", email = "", idioma = "pt" } = agendamento.privado;
  const inicio = new Date(agendamento.inicio).toISOString();
  const contatos = await obterContatos();
  const mensagem = emailCancelamento({ nome, inicio, idioma });
  const [whats, mail] = await Promise.all([
    enviarWhatsApp(whatsapp, whatsappCancelamento({ nome, inicio, idioma })),
    email
      ? enviarEmail({ para: email, assunto: mensagem.assunto, html: mensagem.html, responderPara: contatos.email })
      : Promise.resolve({ enviado: false, motivo: "sem e-mail" }),
  ]);
  if (!whats.enviado) console.error(`[agenda-admin] WhatsApp de cancelamento não enviado (${id}): ${whats.motivo}`);
  if (!mail.enviado) console.error(`[agenda-admin] E-mail de cancelamento não enviado (${id}): ${mail.motivo}`);

  return responder({ ok: true, avisos: { whatsapp: whats.enviado, email: mail.enviado } });
}
