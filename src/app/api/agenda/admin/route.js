import { DIAS_ADMIN, inicioDoDia, dataBrasilia, montarAgendaAdmin } from "@/lib/agenda";
import { listarEventos } from "@/lib/googleAgenda";
import { exigirAdmin, preflight, responder } from "@/lib/rotasAdmin";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return preflight();
}

// Visão da agenda para o painel do gerencial: de hoje até DIAS_ADMIN dias à frente,
// status de cada horário e a lista de próximos agendamentos.
export async function GET(request) {
  const negado = await exigirAdmin(request);
  if (negado) return negado;

  const agora = Date.now();
  const de = inicioDoDia(dataBrasilia(agora));
  const ate = de + (DIAS_ADMIN + 1) * 24 * 60 * 60 * 1000;

  try {
    const eventos = await listarEventos(de, ate);
    return responder(montarAgendaAdmin({ agora, eventos }));
  } catch (erro) {
    console.error("[agenda-admin] Falha ao consultar a agenda:", erro.message);
    return responder({ error: "falha-na-agenda" }, 502);
  }
}
