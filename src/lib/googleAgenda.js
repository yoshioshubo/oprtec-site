import { FUSO_IANA } from "@/lib/agenda";

// Integração com o Google Agenda da OPRtec (oprconsultorias@gmail.com) pela API REST.
// É uma conta Gmail comum: conta de serviço não consegue convidar o cliente nem criar o
// link do Meet nesse tipo de conta, por isso usamos o OAuth do próprio dono da agenda.
// As credenciais ficam só nas variáveis do Railway:
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN e, opcional, GOOGLE_AGENDA_ID.
// Sem elas, a página /avaliacao continua mostrando o formulário do Tally.
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://www.googleapis.com/calendar/v3";

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

async function chamar(caminho, opcoes = {}) {
  const token = await tokenDeAcesso();
  const resposta = await fetch(`${API}${caminho}`, {
    ...opcoes,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!resposta.ok) {
    let motivo = "";
    try {
      motivo = (await resposta.json()).error?.message || "";
    } catch {}
    throw new Error(`Google Agenda ${resposta.status}: ${motivo.slice(0, 200)}`);
  }

  return resposta.json();
}

// Eventos que se sobrepõem ao intervalo [deMs, ateMs), já expandidos (recorrências viram
// ocorrências). Só os campos necessários para saber o que está ocupado.
export async function listarEventos(deMs, ateMs) {
  const agenda = encodeURIComponent(config().agenda);
  const consulta = new URLSearchParams({
    timeMin: new Date(deMs).toISOString(),
    timeMax: new Date(ateMs).toISOString(),
    singleEvents: "true",
    maxResults: "2500",
    fields: "items(status,transparency,start,end,attendees(self,responseStatus)),nextPageToken",
  });

  const eventos = [];
  let pagina;
  do {
    if (pagina) consulta.set("pageToken", pagina);
    const dados = await chamar(`/calendars/${agenda}/events?${consulta}`);
    eventos.push(...(dados.items || []));
    pagina = dados.nextPageToken;
  } while (pagina);

  return eventos;
}

// Cria a videoconferência com link do Google Meet e manda o convite por e-mail ao cliente.
export async function criarEvento({ inicio, fim, titulo, descricao, convidado }) {
  const agenda = encodeURIComponent(config().agenda);
  const corpo = {
    summary: titulo,
    description: descricao,
    start: { dateTime: new Date(inicio).toISOString(), timeZone: FUSO_IANA },
    end: { dateTime: new Date(fim).toISOString(), timeZone: FUSO_IANA },
    attendees: [{ email: convidado.email, displayName: convidado.nome }],
    conferenceData: {
      createRequest: {
        requestId: crypto.randomUUID(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    reminders: { useDefault: true },
  };

  const evento = await chamar(
    `/calendars/${agenda}/events?conferenceDataVersion=1&sendUpdates=all`,
    { method: "POST", body: JSON.stringify(corpo) }
  );

  const meet =
    evento.hangoutLink ||
    evento.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ||
    null;

  return { id: evento.id, meet };
}
