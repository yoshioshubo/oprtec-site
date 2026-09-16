import { firebaseConfig } from "@/firebaseConfig";

// Escrita no Firestore pela API REST, do lado do servidor. Usamos REST (e nao o SDK
// do navegador) porque as rotas de API rodam no Node e nao devem carregar o SDK web;
// a permissao continua vindo das regras do Firestore, iguais para os dois caminhos.
const BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

function valorTipado(valor) {
  if (valor === null || valor === undefined) return { nullValue: null };
  if (typeof valor === "boolean") return { booleanValue: valor };
  if (typeof valor === "number") {
    return Number.isInteger(valor)
      ? { integerValue: String(valor) }
      : { doubleValue: valor };
  }
  if (valor instanceof Date) return { timestampValue: valor.toISOString() };
  return { stringValue: String(valor) };
}

export function paraCampos(dados) {
  return Object.fromEntries(
    Object.entries(dados).map(([chave, valor]) => [chave, valorTipado(valor)])
  );
}

export async function criarDocumento(colecao, dados) {
  const resposta = await fetch(`${BASE}/${colecao}?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: paraCampos(dados) }),
    cache: "no-store",
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text();
    throw new Error(`Firestore ${resposta.status}: ${detalhe.slice(0, 300)}`);
  }

  return resposta.json();
}
