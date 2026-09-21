import { NextResponse } from "next/server";
import { obterIpCliente, verificarLimite } from "@/lib/rateLimit";
import { diasDaAgenda, eventosParaOcupados, horariosCandidatos } from "@/lib/agenda";
import { agendaConfigurada, listarEventos } from "@/lib/googleAgenda";

export const dynamic = "force-dynamic";

const SEM_CACHE = { "Cache-Control": "no-store" };

// Dias da janela pública com os horários livres de cada um, já descontando o que está
// ocupado no Google Agenda. Dia sem horário livre vem com a lista vazia.
export async function GET(request) {
  if (!agendaConfigurada()) {
    return NextResponse.json({ error: "agenda-indisponivel" }, { status: 503 });
  }

  const ip = obterIpCliente(request);
  const { permitido } = verificarLimite(`horarios:${ip}`, { limite: 30 });
  if (!permitido) {
    return NextResponse.json({ error: "muitas-tentativas" }, { status: 429 });
  }

  const agora = Date.now();
  const candidatos = horariosCandidatos(agora);

  try {
    const eventos = candidatos.length
      ? await listarEventos(candidatos[0].inicio, candidatos.at(-1).fim)
      : [];
    const dias = diasDaAgenda({ agora, ocupados: eventosParaOcupados(eventos) });
    return NextResponse.json({ dias }, { headers: SEM_CACHE });
  } catch (erro) {
    console.error("Falha ao consultar a agenda:", erro.message);
    return NextResponse.json({ error: "falha-na-agenda" }, { status: 502 });
  }
}
