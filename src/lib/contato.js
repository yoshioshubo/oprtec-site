// Canais de contato do site. Os valores reais são editados em /admin e ficam no
// Firestore (siteConfig/contatos); estes são o padrão usado enquanto o documento não
// existe ou se a leitura falhar — o site nunca fica sem botão de WhatsApp.
export const TALLY_FORM_ID = "yPbQ0g";

export const CONTATOS_PADRAO = {
  whatsappNumero: "5532991730821",
  whatsappMensagem: {},
  email: "oprconsultorias@gmail.com",
  telefone: "(32) 99173-0821",
};

// Só estes e-mails entram no /admin. A barreira de verdade é a regra do Firestore
// (mesma lista) — esta cópia serve só pra UI avisar quem não tem acesso.
export const ADMINS = ["oprconsultorias@gmail.com", "ygshubo@gmail.com"];

export function linkWhatsApp(numero, mensagem) {
  const base = `https://wa.me/${numero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

// Aceita "(32) 99185-2108", "32991852108" ou "5532991852108" e devolve só dígitos
// com o 55 na frente; null se não parecer um número brasileiro (DDD + 8 ou 9 dígitos).
export function normalizarWhatsApp(entrada) {
  let d = String(entrada || "").replace(/\D/g, "");
  if (d.length === 12 || d.length === 13) {
    if (!d.startsWith("55")) return null;
    d = d.slice(2);
  }
  if (d.length !== 10 && d.length !== 11) return null;
  return `55${d}`;
}

export function formatarWhatsApp(numero) {
  const d = String(numero || "").replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return numero;
}

// Telefone digitado livremente no /admin ("32991730821", "(32) 991730821"...) exibido sempre
// no formato "(32) 99173-0821". Se não parecer um número brasileiro, mostra como foi digitado.
export function formatarTelefone(entrada) {
  const numero = normalizarWhatsApp(entrada);
  return numero ? formatarWhatsApp(numero) : String(entrada || "").trim();
}
