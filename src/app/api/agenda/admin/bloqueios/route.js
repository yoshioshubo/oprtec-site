import {
  DIAS_ADMIN,
  TIPO_BLOQUEIO,
  dataBrasilia,
  eventosParaOcupados,
  horarioOcupado,
  inicioDoDia,
  normalizarEvento,
  validarHorario,
} from "@/lib/agenda";
import { criarBloqueio, excluirEvento, listarEventos, obterEvento } from "@/lib/googleAgenda";
import { exigirAdmin, lerJson, preflight, responder } from "@/lib/rotasAdmin";

const DIA_MS = 24 * 60 * 60 * 1000;

export function OPTIONS() {
  return preflight();
}

// Bloqueia um dia inteiro ({ data: "YYYY-MM-DD" }) ou um horário ({ inicio: ISO }).
// Bloquear não cancela agendamentos já feitos: eles continuam valendo e aparecem no painel.
export async function POST(request) {
  const negado = await exigirAdmin(request);
  if (negado) return negado;

  const body = await lerJson(request);
  if (!body) return responder({ error: "json-invalido" }, 400);

  const agora = Date.now();
  const hoje = inicioDoDia(dataBrasilia(agora));

  try {
    if (body.data !== undefined) {
      const inicio = inicioDoDia(body.data);
      if (Number.isNaN(inicio) || inicio < hoje || inicio > hoje + DIAS_ADMIN * DIA_MS) {
        return responder({ error: "data-invalida" }, 400);
      }
      const eventos = await listarEventos(inicio, inicio + DIA_MS);
      const jaBloqueado = eventos
        .map(normalizarEvento)
        .some((e) => e?.tipo === TIPO_BLOQUEIO && e.diaInteiro);
      if (jaBloqueado) return responder({ error: "ja-bloqueado" }, 409);

      const { id } = await criarBloqueio({ data: body.data });
      return responder({ ok: true, id });
    }

    // Horário: qualquer horário da grade a partir de agora, sem a antecedência de 24h do site.
    const horario = validarHorario(body.inicio, agora, { dias: DIAS_ADMIN, antecedenciaMs: 0 });
    if (!horario) return responder({ error: "horario-invalido" }, 400);

    const eventos = await listarEventos(horario.inicio, horario.fim);
    if (horarioOcupado(horario, eventosParaOcupados(eventos))) {
      return responder({ error: "horario-ocupado" }, 409);
    }

    const { id } = await criarBloqueio({ inicio: horario.inicio, fim: horario.fim });
    return responder({ ok: true, id });
  } catch (erro) {
    console.error("[agenda-admin] Falha ao bloquear:", erro.message);
    return responder({ error: "falha-na-agenda" }, 502);
  }
}

// Desbloqueia. Só apaga evento criado como bloqueio pelo painel — nunca um compromisso
// qualquer da agenda nem um agendamento de cliente.
export async function DELETE(request) {
  const negado = await exigirAdmin(request);
  if (negado) return negado;

  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^[A-Za-z0-9_-]{1,1024}$/.test(id)) return responder({ error: "id-invalido" }, 400);

  try {
    const evento = await obterEvento(id);
    if (evento?.extendedProperties?.private?.oprtec !== TIPO_BLOQUEIO) {
      return responder({ error: "nao-e-bloqueio" }, 403);
    }
    await excluirEvento(id);
    return responder({ ok: true });
  } catch (erro) {
    if (erro.status === 404 || erro.status === 410) return responder({ ok: true });
    console.error("[agenda-admin] Falha ao desbloquear:", erro.message);
    return responder({ error: "falha-na-agenda" }, 502);
  }
}
