// Textos das notificações da agenda (WhatsApp e e-mail). Puro, sem rede, para poder ser
// testado. Tudo que vem do visitante (nome, empresa...) é escapado no HTML do e-mail —
// sem isso alguém poderia pôr HTML ou link disfarçado dentro de um e-mail que sai com a
// identidade da OPRtec.
import { FUSO_IANA } from "./agenda.js";

const LOCALES = { pt: "pt-BR", en: "en-US", es: "es" };
const idiomaValido = (idioma) => (LOCALES[idioma] ? idioma : "pt");

export function formatarDataHora(iso, idioma = "pt") {
  const texto = new Intl.DateTimeFormat(LOCALES[idiomaValido(idioma)], {
    timeZone: FUSO_IANA,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function escaparHtml(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// WhatsApp aceita *negrito*; tirar os asteriscos do texto do visitante evita que ele
// quebre a formatação da mensagem.
const semMarcacao = (texto) => String(texto ?? "").replace(/[*_~`]/g, "").trim();

const TEXTOS = {
  pt: {
    fuso: "horário de Brasília",
    confirmacao: ({ nome, quando, meet, atendimento }) =>
      `Olá, ${nome}! Sua *avaliação gratuita com a OPRtec* está confirmada para *${quando}* (horário de Brasília).\n\n` +
      (meet ? `Link da videoconferência (Google Meet):\n${meet}\n\n` : "") +
      "_Esta é uma mensagem automática._" +
      (atendimento ? ` Para remarcar ou tirar dúvidas, fale com a gente: ${atendimento}` : ""),
    cancelamento: ({ nome, quando, atendimento }) =>
      `Olá, ${nome}. A sua avaliação gratuita com a OPRtec marcada para *${quando}* (horário de Brasília) foi cancelada.\n\n` +
      "Para escolher outro horário: https://www.oprtec.com.br/avaliacao\n\n" +
      "_Esta é uma mensagem automática._" +
      (atendimento ? ` Dúvidas? Fale com a gente: ${atendimento}` : ""),
    assunto: "Avaliação gratuita confirmada — OPRtec",
    assuntoCancelamento: "Avaliação gratuita cancelada — OPRtec",
    ola: "Olá",
    corpo: "Sua avaliação gratuita com a OPRtec está confirmada:",
    dataHora: "Data e horário",
    duracao: "Duração",
    duracaoValor: "30 minutos, por videoconferência",
    botaoMeet: "Entrar no Google Meet",
    remarcar: "Se precisar remarcar, é só responder este e-mail.",
    corpoCancelamento: "A sua avaliação gratuita com a OPRtec foi cancelada:",
    novoHorario: "Escolher outro horário",
    assinatura: "Equipe OPRtec",
  },
  en: {
    fuso: "Brasília time",
    confirmacao: ({ nome, quando, meet, atendimento }) =>
      `Hi, ${nome}! Your *free assessment with OPRtec* is confirmed for *${quando}* (Brasília time).\n\n` +
      (meet ? `Video call link (Google Meet):\n${meet}\n\n` : "") +
      "_This is an automated message._" +
      (atendimento ? ` To reschedule or ask a question, reach us here: ${atendimento}` : ""),
    cancelamento: ({ nome, quando, atendimento }) =>
      `Hi, ${nome}. Your free assessment with OPRtec scheduled for *${quando}* (Brasília time) has been cancelled.\n\n` +
      "To pick another time: https://www.oprtec.com.br/en/avaliacao\n\n" +
      "_This is an automated message._" +
      (atendimento ? ` Questions? Reach us here: ${atendimento}` : ""),
    assunto: "Free assessment confirmed — OPRtec",
    assuntoCancelamento: "Free assessment cancelled — OPRtec",
    ola: "Hi",
    corpo: "Your free assessment with OPRtec is confirmed:",
    dataHora: "Date and time",
    duracao: "Length",
    duracaoValor: "30 minutes, by video call",
    botaoMeet: "Join Google Meet",
    remarcar: "If you need to reschedule, just reply to this email.",
    corpoCancelamento: "Your free assessment with OPRtec has been cancelled:",
    novoHorario: "Pick another time",
    assinatura: "The OPRtec team",
  },
  es: {
    fuso: "hora de Brasilia",
    confirmacao: ({ nome, quando, meet, atendimento }) =>
      `¡Hola, ${nome}! Tu *evaluación gratuita con OPRtec* está confirmada para el *${quando}* (hora de Brasilia).\n\n` +
      (meet ? `Enlace de la videoconferencia (Google Meet):\n${meet}\n\n` : "") +
      "_Este es un mensaje automático._" +
      (atendimento ? ` Para reagendar o resolver dudas, escríbenos aquí: ${atendimento}` : ""),
    cancelamento: ({ nome, quando, atendimento }) =>
      `Hola, ${nome}. Tu evaluación gratuita con OPRtec agendada para el *${quando}* (hora de Brasilia) fue cancelada.\n\n` +
      "Para elegir otro horario: https://www.oprtec.com.br/es/avaliacao\n\n" +
      "_Este es un mensaje automático._" +
      (atendimento ? ` ¿Dudas? Escríbenos aquí: ${atendimento}` : ""),
    assunto: "Evaluación gratuita confirmada — OPRtec",
    assuntoCancelamento: "Evaluación gratuita cancelada — OPRtec",
    ola: "Hola",
    corpo: "Tu evaluación gratuita con OPRtec está confirmada:",
    dataHora: "Fecha y hora",
    duracao: "Duración",
    duracaoValor: "30 minutos, por videoconferencia",
    botaoMeet: "Entrar a Google Meet",
    remarcar: "Si necesitas reagendar, solo responde este correo.",
    corpoCancelamento: "Tu evaluación gratuita con OPRtec fue cancelada:",
    novoHorario: "Elegir otro horario",
    assinatura: "Equipo OPRtec",
  },
};

// As mensagens saem pelo número do bot do gerencial, que não conversa com cliente: número
// desconhecido é ignorado e operador cadastrado recebe o menu do sistema. Por isso nunca
// pedimos "responda esta mensagem" — o texto avisa que é automático e aponta o WhatsApp de
// atendimento da OPRtec (o cadastrado no /admin do site).
const linkAtendimento = (numero) => {
  const digitos = String(numero || "").replace(/\D/g, "");
  return digitos ? `https://wa.me/${digitos}` : "";
};

export function whatsappConfirmacao({ nome, inicio, meet, idioma, whatsappOprtec }) {
  const i = idiomaValido(idioma);
  return TEXTOS[i].confirmacao({
    nome: semMarcacao(nome),
    quando: formatarDataHora(inicio, i),
    meet,
    atendimento: linkAtendimento(whatsappOprtec),
  });
}

export function whatsappCancelamento({ nome, inicio, idioma, whatsappOprtec }) {
  const i = idiomaValido(idioma);
  return TEXTOS[i].cancelamento({
    nome: semMarcacao(nome),
    quando: formatarDataHora(inicio, i),
    atendimento: linkAtendimento(whatsappOprtec),
  });
}

// Aviso interno para a OPRtec, sempre em português.
export function whatsappAvisoOprtec({ empresa, nome, whatsapp, email, inicio, meet }) {
  return (
    "📅 *Nova avaliação agendada pelo site*\n\n" +
    `*${formatarDataHora(inicio, "pt")}*\n` +
    `Empresa: ${semMarcacao(empresa)}\n` +
    `Contato: ${semMarcacao(nome)}\n` +
    `WhatsApp: ${semMarcacao(whatsapp)}\n` +
    `E-mail: ${semMarcacao(email)}` +
    (meet ? `\n\nMeet: ${meet}` : "")
  );
}

function moldura(conteudo) {
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;padding:24px 12px;">
<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px 24px;color:#0f172a;font-size:15px;line-height:1.6;">
<img src="https://www.oprtec.com.br/logo.png" alt="OPRtec" width="130" style="display:block;margin-bottom:20px;" />
${conteudo}
</div></body></html>`;
}

export function emailConfirmacao({ nome, inicio, meet, idioma }) {
  const i = idiomaValido(idioma);
  const t = TEXTOS[i];
  const quando = escaparHtml(formatarDataHora(inicio, i));
  const html = moldura(`
<p>${t.ola}, ${escaparHtml(nome)}!</p>
<p>${t.corpo}</p>
<p style="background:#f1f5f9;border-radius:8px;padding:14px 16px;font-size:14px;">
<strong>${t.dataHora}:</strong> ${quando} (${t.fuso})<br/>
<strong>${t.duracao}:</strong> ${t.duracaoValor}
</p>
${meet ? `<p style="text-align:center;margin:24px 0;"><a href="${escaparHtml(meet)}" style="background:#0891b2;color:#ffffff;padding:12px 26px;border-radius:999px;text-decoration:none;font-weight:bold;display:inline-block;">${t.botaoMeet}</a></p><p style="font-size:13px;color:#475569;word-break:break-all;">${escaparHtml(meet)}</p>` : ""}
<p>${t.remarcar}</p>
<p>${t.assinatura}</p>`);
  return { assunto: t.assunto, html };
}

export function emailCancelamento({ nome, inicio, idioma }) {
  const i = idiomaValido(idioma);
  const t = TEXTOS[i];
  const quando = escaparHtml(formatarDataHora(inicio, i));
  const link = `https://www.oprtec.com.br${i === "pt" ? "" : `/${i}`}/avaliacao`;
  const html = moldura(`
<p>${t.ola}, ${escaparHtml(nome)}.</p>
<p>${t.corpoCancelamento}</p>
<p style="background:#f1f5f9;border-radius:8px;padding:14px 16px;font-size:14px;"><strong>${t.dataHora}:</strong> ${quando} (${t.fuso})</p>
<p style="text-align:center;margin:24px 0;"><a href="${link}" style="background:#0891b2;color:#ffffff;padding:12px 26px;border-radius:999px;text-decoration:none;font-weight:bold;display:inline-block;">${t.novoHorario}</a></p>
<p>${t.assinatura}</p>`);
  return { assunto: t.assuntoCancelamento, html };
}
