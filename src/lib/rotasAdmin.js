import { NextResponse } from "next/server";
import { CORS, verificarSuperAdmin } from "@/lib/autorizacaoGerencial";
import { agendaConfigurada } from "@/lib/googleAgenda";

// Casca comum das rotas /api/agenda/admin/*: CORS, agenda configurada e super_admin.
export function responder(dados, status = 200) {
  return NextResponse.json(dados, { status, headers: { ...CORS, "Cache-Control": "no-store" } });
}

export function preflight() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// Uso: const negado = await exigirAdmin(request); if (negado) return negado;
export async function exigirAdmin(request) {
  if (!agendaConfigurada()) return responder({ error: "agenda-indisponivel" }, 503);
  const autorizacao = await verificarSuperAdmin(request);
  if (!autorizacao.ok) return responder({ error: autorizacao.error }, autorizacao.status);
  return null;
}

export async function lerJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
