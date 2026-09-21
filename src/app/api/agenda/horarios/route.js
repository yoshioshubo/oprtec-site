import { NextResponse } from "next/server";
import { obterIpCliente, verificarLimite } from "@/lib/rateLimit";
import { eventosParaOcupados, horariosCandidatos, horariosLivres } from "@/lib/agenda";
import { agendaConfigurada, listarEventos } from "@/lib/googleAgenda";

export const dynamic = "force-dynamic";

const SEM_CACHE = { "Cache-Control": "no-store" };

// Horários livres da avaliação gratuita, já descontando o que está ocupado no Google Agenda.
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
  if (!candidatos.length) {
    return NextResponse.json({ horarios: [] }, { headers: SEM_CACHE });
  }

  try {
    const eventos = await listarEventos(candidatos[0].inicio, candidatos.at(-1).fim);
    const horarios = horariosLivres({ agora, ocupados: eventosParaOcupados(eventos) });
    return NextResponse.json({ horarios }, { headers: SEM_CACHE });
  } catch (erro) {
    console.error("Falha ao consultar a agenda:", erro.message);
    return NextResponse.json({ error: "falha-na-agenda" }, { status: 502 });
  }
}
