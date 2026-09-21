// Regras da agenda da avaliação gratuita (definidas pelo Yoshio em 21/09/2026):
// seg–sex, das 9h às 12h e das 14h às 18h, videoconferências de 30 min, marcadas com
// pelo menos 24h de antecedência, até 14 dias à frente.
// Todos os horários são de Brasília. O Brasil não tem horário de verão desde 2019, então
// o fuso fica fixo em -03:00; se o horário de verão voltar, este arquivo precisa mudar.
//
// A fonte da verdade é o Google Agenda da OPRtec: agendamentos e bloqueios são eventos
// lá, marcados com a propriedade privada `oprtec` ("agendamento" ou "bloqueio"). Qualquer
// outro compromisso da agenda também tira o horário do site.
export const FUSO_IANA = "America/Sao_Paulo";
const OFFSET = "-03:00";
const OFFSET_MS = -3 * 60 * 60 * 1000;

export const DURACAO_MIN = 30;
const JANELAS = [
  [9 * 60, 12 * 60],
  [14 * 60, 18 * 60],
]; // em minutos desde a meia-noite
const DIAS_UTEIS = new Set([1, 2, 3, 4, 5]);
export const ANTECEDENCIA_MS = 24 * 60 * 60 * 1000;
export const DIAS_A_FRENTE = 14;
// Até onde o painel do gerencial deixa ver e bloquear (férias, viagens...).
export const DIAS_ADMIN = 90;
const DIA_MS = 24 * 60 * 60 * 1000;

export const TIPO_AGENDAMENTO = "agendamento";
export const TIPO_BLOQUEIO = "bloqueio";

const doisDigitos = (n) => String(n).padStart(2, "0");

function isoBrasilia(ano, mes, dia, minutos) {
  const hora = `${doisDigitos(Math.floor(minutos / 60))}:${doisDigitos(minutos % 60)}`;
  return `${ano}-${doisDigitos(mes)}-${doisDigitos(dia)}T${hora}:00${OFFSET}`;
}

// "YYYY-MM-DD" (data de Brasília) de um instante.
export function dataBrasilia(ms) {
  return new Date(ms + OFFSET_MS).toISOString().slice(0, 10);
}

// Instante da meia-noite de Brasília de uma data "YYYY-MM-DD"; NaN se inválida.
export function inicioDoDia(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data || ""))) return NaN;
  const ms = Date.parse(`${data}T00:00:00${OFFSET}`);
  // Date.parse aceita "2026-02-31" virando março; conferir a volta evita isso.
  return !Number.isNaN(ms) && dataBrasilia(ms) === data ? ms : NaN;
}

// Datas de hoje até hoje + dias (Brasília), com o dia da semana (0 = domingo).
export function datasDaJanela(agora, dias) {
  const hoje = new Date(agora + OFFSET_MS);
  const lista = [];
  for (let d = 0; d <= dias; d++) {
    const dia = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate() + d));
    lista.push({
      data: dia.toISOString().slice(0, 10),
      ano: dia.getUTCFullYear(),
      mes: dia.getUTCMonth() + 1,
      dia: dia.getUTCDate(),
      diaSemana: dia.getUTCDay(),
    });
  }
  return lista;
}

export const diaUtil = (diaSemana) => DIAS_UTEIS.has(diaSemana);

// Horários de um dia útil (sem olhar ocupação nem antecedência).
function horariosDoDia({ ano, mes, dia }) {
  const lista = [];
  for (const [abre, fecha] of JANELAS) {
    for (let m = abre; m + DURACAO_MIN <= fecha; m += DURACAO_MIN) {
      const iso = isoBrasilia(ano, mes, dia, m);
      const inicio = Date.parse(iso);
      lista.push({ iso, inicio, fim: inicio + DURACAO_MIN * 60 * 1000 });
    }
  }
  return lista;
}

// Todos os horários que a agenda oferece a partir de agora, sem olhar o que já está ocupado.
export function horariosCandidatos(
  agora = Date.now(),
  { dias = DIAS_A_FRENTE, antecedenciaMs = ANTECEDENCIA_MS } = {}
) {
  const minimo = agora + antecedenciaMs;
  return datasDaJanela(agora, dias)
    .filter((d) => diaUtil(d.diaSemana))
    .flatMap(horariosDoDia)
    .filter((h) => h.inicio >= minimo);
}

const sobrepoe = (a, b) => a.inicio < b.fim && a.fim > b.inicio;

export function horarioOcupado(horario, ocupados = []) {
  return ocupados.some((o) => sobrepoe(o, horario));
}

export function horariosLivres({ agora = Date.now(), ocupados = [] } = {}) {
  return horariosCandidatos(agora)
    .filter((h) => !horarioOcupado(h, ocupados))
    .map((h) => h.iso);
}

// Todos os dias da janela pública (inclusive fins de semana), cada um com os horários
// livres. É o que o calendário do site pinta: dia com horário = verde, sem = vermelho.
export function diasDaAgenda({ agora = Date.now(), ocupados = [] } = {}) {
  const porData = new Map();
  for (const iso of horariosLivres({ agora, ocupados })) {
    const data = iso.slice(0, 10);
    if (!porData.has(data)) porData.set(data, []);
    porData.get(data).push(iso);
  }
  return datasDaJanela(agora, DIAS_A_FRENTE).map((d) => ({
    data: d.data,
    horarios: porData.get(d.data) || [],
  }));
}

// Só aceita um horário que a própria agenda ofereceria agora. A ocupação é conferida
// à parte, na hora de marcar, com a agenda do Google.
export function validarHorario(texto, agora = Date.now(), opcoes) {
  const ms = Date.parse(String(texto || ""));
  if (Number.isNaN(ms)) return null;
  return horariosCandidatos(agora, opcoes).find((h) => h.inicio === ms) || null;
}

// Evento da API do Google Agenda → formato interno. null quando não ocupa a agenda:
// - cancelados e convites recusados;
// - evento com horário marcado como "livre" (transparent).
// Evento de dia inteiro ocupa o dia todo, mesmo marcado como "livre" — é o jeito mais
// simples de fechar a agenda num feriado ou numa viagem direto pelo Google Agenda.
export function normalizarEvento(evento) {
  if (!evento || evento.status === "cancelled") return null;
  const eu = (evento.attendees || []).find((a) => a.self);
  if (eu && eu.responseStatus === "declined") return null;

  const privado = evento.extendedProperties?.private || {};
  const tipo = [TIPO_AGENDAMENTO, TIPO_BLOQUEIO].includes(privado.oprtec) ? privado.oprtec : "outro";
  const base = { id: evento.id || null, tipo, titulo: evento.summary || "", privado };

  if (evento.start?.date) {
    const inicio = inicioDoDia(evento.start.date);
    if (Number.isNaN(inicio)) return null;
    const fimData = inicioDoDia(evento.end?.date);
    return { ...base, diaInteiro: true, inicio, fim: Number.isNaN(fimData) ? inicio + DIA_MS : fimData };
  }

  if (evento.transparency === "transparent") return null;
  const inicio = Date.parse(evento.start?.dateTime || "");
  const fim = Date.parse(evento.end?.dateTime || "");
  if (Number.isNaN(inicio) || Number.isNaN(fim) || fim <= inicio) return null;
  return { ...base, diaInteiro: false, inicio, fim, meet: evento.hangoutLink || null };
}

export function eventosParaOcupados(eventos = []) {
  return eventos
    .map(normalizarEvento)
    .filter(Boolean)
    .map(({ inicio, fim }) => ({ inicio, fim }));
}

const PRIORIDADE = { [TIPO_AGENDAMENTO]: 3, [TIPO_BLOQUEIO]: 2, outro: 1 };

// Visão completa para o painel do gerencial: cada dia da janela do admin com o status de
// cada horário, mais a lista de agendamentos e bloqueios. Pura, para poder ser testada.
export function montarAgendaAdmin({ agora = Date.now(), eventos = [] } = {}) {
  const normalizados = eventos.map(normalizarEvento).filter(Boolean);

  const dias = datasDaJanela(agora, DIAS_ADMIN).map((d) => {
    const util = diaUtil(d.diaSemana);
    const inicioDia = inicioDoDia(d.data);
    const intervaloDia = { inicio: inicioDia, fim: inicioDia + DIA_MS };
    const bloqueioDia = normalizados.find(
      (e) => e.tipo === TIPO_BLOQUEIO && e.diaInteiro && sobrepoe(e, intervaloDia)
    );

    const horarios = util
      ? horariosDoDia(d).map((h) => {
          const conflito = normalizados
            .filter((e) => sobrepoe(e, h))
            .sort((a, b) => PRIORIDADE[b.tipo] - PRIORIDADE[a.tipo])[0];
          let status = "livre";
          if (conflito?.tipo === TIPO_AGENDAMENTO) status = "agendado";
          else if (conflito?.tipo === TIPO_BLOQUEIO) status = "bloqueado";
          else if (conflito) status = "ocupado";
          else if (h.inicio < agora) status = "passado";
          return {
            iso: h.iso,
            status,
            eventoId: conflito?.id || null,
            // Bloqueio de dia inteiro aparece no dia; o de horário, no próprio horário.
            removivel: conflito?.tipo === TIPO_BLOQUEIO && !conflito.diaInteiro,
            rotulo:
              conflito?.tipo === TIPO_AGENDAMENTO
                ? conflito.privado.empresa || conflito.titulo
                : conflito?.tipo === "outro"
                  ? conflito.titulo || "Compromisso na agenda"
                  : null,
          };
        })
      : [];

    return { data: d.data, util, bloqueioDiaId: bloqueioDia?.id || null, horarios };
  });

  const agendamentos = normalizados
    .filter((e) => e.tipo === TIPO_AGENDAMENTO && e.fim > agora)
    .sort((a, b) => a.inicio - b.inicio)
    .map((e) => ({
      id: e.id,
      inicio: new Date(e.inicio).toISOString(),
      fim: new Date(e.fim).toISOString(),
      empresa: e.privado.empresa || e.titulo,
      nome: e.privado.nome || "",
      whatsapp: e.privado.whatsapp || "",
      email: e.privado.email || "",
      idioma: e.privado.idioma || "pt",
      meet: e.meet || null,
    }));

  return { geradoEm: new Date(agora).toISOString(), dias, agendamentos };
}
