import { FUSO_IANA, TIPO_AGENDAMENTO, TIPO_BLOQUEIO } from "@/lib/agenda";

// Integração com o Google Agenda da OPRtec (oprconsultorias@gmail.com) pela API REST.
// É uma conta Gmail comum: conta de serviço não consegue convidar o cliente nem criar o
// link do Meet nesse tipo de conta, por isso usamos o OAuth do próprio dono da agenda.
// As credenciais ficam só nas variáveis do Railway:
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN e, opcional, GOOGLE_AGENDA_ID.
// Sem elas, a página /avaliacao continua mostrando o formulário do Tally.
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://www.googleapis.com/calendar/v3";
const TEMPO_LIMITE_MS = 10_000;

function config() {
  return {
    id: process.env.GOOGLE_CLIENT_ID,
    segredo: process.env.GOOGLE_CLIENT_SECRET,
    refresh: process.env.GOOGLE_REFRESH_TOKEN,
    agenda: process.env.GOOGLE_AGENDA_ID || "primary",
  };
}

export function agendaConfigurada() {
  const c = config();
  return Boolean(c.id && c.segredo && c.refresh);
}

let tokenEmCache = null;

async function tokenDeAcesso() {
  if (tokenEmCache && Date.now() < tokenEmCache.expiraEm) return tokenEmCache.valor;

  const c = config();
  const resposta = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.id,
      client_secret: c.segredo,
      refresh_token: c.refresh,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
  });

  // Nos erros só expomos o status e o código do Google — nunca o corpo da requisição,
  // que tem o segredo e o refresh token.
  if (!resposta.ok) {
    let codigo = "";
    try {
      codigo = (await resposta.json()).error || "";
    } catch {}
    throw new Error(`Google OAuth ${resposta.status} ${codigo}`.trim());
  }

  const dados = await resposta.json();
  tokenEmCache = {
    valor: dados.access_token,
    expiraEm: Date.now() + (Number(dados.expires_in || 3600) - 60) * 1000,
  };
  return tokenEmCache.valor;
}

export class ErroGoogle extends Error {
  constructor(status, motivo) {
    super(`Google Agenda ${status}: ${motivo}`);
    this.status = status;
  }
}

async function chamar(caminho, opcoes = {}) {
  const token = await tokenDeAcesso();
  const resposta = await fetch(`${API}${caminho}`, {
    ...opcoes,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
  });

  if (!resposta.ok) {
    let motivo = "";
    try {
      motivo = (await resposta.json()).error?.message || "";
    } catch {}
    throw new ErroGoogle(resposta.status, motivo.slice(0, 200));
  }

  // DELETE devolve 204 sem corpo.
  return resposta.status === 204 ? null : resposta.json();
}

const caminhoAgenda = () => `/calendars/${encodeURIComponent(config().agenda)}`;

const CAMPOS_EVENTO =
  "id,status,summary,transparency,start,end,hangoutLink,extendedProperties,attendees(self,responseStatus)";

// Eventos que se sobrepõem ao intervalo [deMs, ateMs), já expandidos (recorrências viram
// ocorrências). Só os campos necessários para saber o que está ocupado e o que é nosso.
export async function listarEventos(deMs, ateMs) {
  const consulta = new URLSearchParams({
    timeMin: new Date(deMs).toISOString(),
    timeMax: new Date(ateMs).toISOString(),
    singleEvents: "true",
    maxResults: "2500",
    fields: `items(${CAMPOS_EVENTO}),nextPageToken`,
  });

  const eventos = [];
  let pagina;
  do {
    if (pagina) consulta.set("pageToken", pagina);
    const dados = await chamar(`${caminhoAgenda()}/events?${consulta}`);
    eventos.push(...(dados.items || []));
    pagina = dados.nextPageToken;
  } while (pagina);

  return eventos;
}

export async function obterEvento(id) {
  return chamar(`${caminhoAgenda()}/events/${encodeURIComponent(id)}?fields=${encodeURIComponent(CAMPOS_EVENTO)}`);
}

// Cria a videoconferência com link do Google Meet e manda o convite por e-mail ao cliente.
// Os dados do cliente vão em propriedades privadas (só a agenda da OPRtec vê), para o
// painel do gerencial listar os agendamentos sem depender do texto da descrição.
export async function criarAgendamento({ inicio, fim, titulo, descricao, cliente }) {
  const corpo = {
    summary: titulo,
    description: descricao,
    start: { dateTime: new Date(inicio).toISOString(), timeZone: FUSO_IANA },
    end: { dateTime: new Date(fim).toISOString(), timeZone: FUSO_IANA },
    attendees: [{ email: cliente.email, displayName: cliente.nome }],
    conferenceData: {
      createRequest: {
        requestId: crypto.randomUUID(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    extendedProperties: {
      private: {
        oprtec: TIPO_AGENDAMENTO,
        empresa: cliente.empresa,
        nome: cliente.nome,
        whatsapp: cliente.whatsapp,
        email: cliente.email,
        idioma: cliente.idioma,
      },
    },
    reminders: { useDefault: true },
  };

  const evento = await chamar(`${caminhoAgenda()}/events?conferenceDataVersion=1&sendUpdates=all`, {
    method: "POST",
    body: JSON.stringify(corpo),
  });

  const meet =
    evento.hangoutLink ||
    evento.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ||
    null;

  return { id: evento.id, meet };
}

// Bloqueio feito pelo painel do gerencial: um evento "ocupado" na própria agenda.
// Dia inteiro: { data: "YYYY-MM-DD" }. Horário: { inicio, fim } em ms.
export async function criarBloqueio({ data, inicio, fim }) {
  const quando = data
    ? {
        start: { date: data },
        end: { date: new Date(Date.parse(`${data}T12:00:00Z`) + 86_400_000).toISOString().slice(0, 10) },
      }
    : {
        start: { dateTime: new Date(inicio).toISOString(), timeZone: FUSO_IANA },
        end: { dateTime: new Date(fim).toISOString(), timeZone: FUSO_IANA },
      };

  const evento = await chamar(`${caminhoAgenda()}/events?sendUpdates=none`, {
    method: "POST",
    body: JSON.stringify({
      summary: "Bloqueado — agenda do site",
      description: "Criado pelo painel Agenda de Avaliações (gerencial). Enquanto existir, o site não oferece este horário.",
      transparency: "opaque",
      ...quando,
      extendedProperties: { private: { oprtec: TIPO_BLOQUEIO } },
    }),
  });
  return { id: evento.id };
}

// Apaga um evento. `avisar` manda o cancelamento do Google para os convidados.
// Evento que já não existe (404/410) conta como apagado.
export async function excluirEvento(id, { avisar = false } = {}) {
  try {
    await chamar(`${caminhoAgenda()}/events/${encodeURIComponent(id)}?sendUpdates=${avisar ? "all" : "none"}`, {
      method: "DELETE",
    });
  } catch (erro) {
    if (erro instanceof ErroGoogle && (erro.status === 404 || erro.status === 410)) return;
    throw erro;
  }
}
