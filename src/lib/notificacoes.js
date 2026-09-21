// Envio de WhatsApp e e-mail da agenda. Reaproveita a infraestrutura que o gerencial já
// usa nas confirmações de reserva:
//   - WhatsApp: rota interna /internal/enviar do whatsapp-bridge
//     (WHATSAPP_BRIDGE_URL + INTERNAL_TOKEN, os mesmos valores do integracoes-gateway);
//   - e-mail: Resend (RESEND_API_KEY + EMAIL_FROM, também os mesmos do gateway).
// Nunca lança erro: notificação que falha não pode desfazer um agendamento já feito.
// Devolve { enviado, motivo } para quem chamou registrar no log.
const TEMPO_LIMITE_MS = 15_000;

export async function enviarWhatsApp(telefone, texto) {
  const url = process.env.WHATSAPP_BRIDGE_URL;
  const token = process.env.INTERNAL_TOKEN;
  if (!url || !token) return { enviado: false, motivo: "WHATSAPP_BRIDGE_URL/INTERNAL_TOKEN ausentes" };
  if (!telefone) return { enviado: false, motivo: "telefone vazio" };

  try {
    const resposta = await fetch(`${url.replace(/\/+$/, "")}/internal/enviar`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-token": token },
      body: JSON.stringify({ telefone, texto }),
      cache: "no-store",
      signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    });
    if (resposta.ok) return { enviado: true };
    const corpo = await resposta.json().catch(() => ({}));
    return { enviado: false, motivo: `bridge ${resposta.status}: ${String(corpo.error || "").slice(0, 150)}` };
  } catch (erro) {
    return { enviado: false, motivo: erro.name === "TimeoutError" ? "tempo esgotado" : erro.message };
  }
}

export async function enviarEmail({ para, assunto, html, responderPara }) {
  const chave = process.env.RESEND_API_KEY;
  const de = process.env.EMAIL_FROM;
  // Sem EMAIL_FROM de um domínio verificado, o Resend só entrega para o dono da conta —
  // melhor não tentar do que "enviar" algo que nunca chega.
  if (!chave || !de) return { enviado: false, motivo: "RESEND_API_KEY/EMAIL_FROM ausentes" };

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${chave}` },
      body: JSON.stringify({
        from: de,
        to: [para],
        subject: assunto,
        html,
        ...(responderPara ? { reply_to: responderPara } : {}),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    });
    if (resposta.ok) return { enviado: true };
    const corpo = await resposta.json().catch(() => ({}));
    return { enviado: false, motivo: `resend ${resposta.status}: ${String(corpo.message || "").slice(0, 150)}` };
  } catch (erro) {
    return { enviado: false, motivo: erro.name === "TimeoutError" ? "tempo esgotado" : erro.message };
  }
}
