import { firebaseConfig } from "@/firebaseConfig";
import { CONTATOS_PADRAO } from "./contato";

const URL_CONTATOS = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/siteConfig/contatos?key=${firebaseConfig.apiKey}`;

function texto(campo) {
  return typeof campo?.stringValue === "string" ? campo.stringValue.trim() : "";
}

/**
 * Lê os contatos editados no /admin. Via REST (não o SDK) pra rodar no servidor durante
 * a renderização; `revalidate: 60` faz a página ser regenerada em até 1 minuto depois de
 * uma alteração, sem precisar publicar o site de novo. Qualquer falha (documento ainda
 * não criado, regra não publicada, rede) cai no padrão.
 */
export async function obterContatos() {
  try {
    const r = await fetch(URL_CONTATOS, { next: { revalidate: 60 } });
    if (!r.ok) return CONTATOS_PADRAO;
    const { fields = {} } = await r.json();
    const msgs = fields.whatsappMensagem?.mapValue?.fields || {};
    return {
      whatsappNumero: texto(fields.whatsappNumero) || CONTATOS_PADRAO.whatsappNumero,
      whatsappMensagem: {
        pt: texto(msgs.pt),
        en: texto(msgs.en),
        es: texto(msgs.es),
      },
      email: texto(fields.email) || CONTATOS_PADRAO.email,
      telefone: fields.telefone ? texto(fields.telefone) : CONTATOS_PADRAO.telefone,
    };
  } catch {
    return CONTATOS_PADRAO;
  }
}
