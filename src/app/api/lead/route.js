import { NextResponse } from "next/server";
import { obterIpCliente, verificarLimite } from "@/lib/rateLimit";
import { criarDocumento } from "@/lib/firestoreRest";

// Limites um pouco abaixo dos das regras do Firestore (200/200/30/2000).
const LIMITES = { nome: 190, estabelecimento: 190, whatsapp: 25, desafio: 1900 };

const LIMITE_ENVIOS = 3;

export async function POST(request) {
  // Chave separada da do /api/assinar para os dois contadores nao se misturarem.
  const ip = obterIpCliente(request);
  const { permitido } = verificarLimite(`lead:${ip}`, { limite: LIMITE_ENVIOS });
  if (!permitido) {
    return NextResponse.json({ error: "muitas-tentativas" }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "json-invalido" }, { status: 400 });
  }

  // Honeypot: campo escondido no formulario, que pessoa nenhuma ve nem preenche.
  // Bot que preenche tudo cai aqui. Respondemos 200 de proposito - avisar que foi
  // recusado so ensinaria o bot a tentar de novo sem o campo.
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

  if (body.aceitouPrivacidade !== true) {
    return NextResponse.json({ error: "aceite-obrigatorio" }, { status: 400 });
  }

  try {
    await criarDocumento("leads", {
      ...campos,
      status: "novo",
      criadoEm: new Date(),
    });
  } catch (erro) {
    console.error("Falha ao gravar lead:", erro);
    return NextResponse.json({ error: "falha-ao-gravar" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
