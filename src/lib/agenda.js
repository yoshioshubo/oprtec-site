// Regras da agenda da avaliação gratuita (definidas pelo Yoshio em 21/09/2026):
// seg–sex, das 9h às 12h e das 14h às 18h, videoconferências de 30 min, marcadas com
// pelo menos 24h de antecedência, até 14 dias à frente.
// Todos os horários são de Brasília. O Brasil não tem horário de verão desde 2019, então
// o fuso fica fixo em -03:00; se o horário de verão voltar, este arquivo precisa mudar.
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
const DIA_MS = 24 * 60 * 60 * 1000;

const doisDigitos = (n) => String(n).padStart(2, "0");

function isoBrasilia(ano, mes, dia, minutos) {
  const hora = `${doisDigitos(Math.floor(minutos / 60))}:${doisDigitos(minutos % 60)}`;
  return `${ano}-${doisDigitos(mes)}-${doisDigitos(dia)}T${hora}:00${OFFSET}`;
}

// Todos os horários que a agenda oferece a partir de agora, sem olhar o que já está ocupado.
export function horariosCandidatos(agora = Date.now()) {
  const minimo = agora + ANTECEDENCIA_MS;
  // Deslocando pelo fuso, os getters UTC passam a devolver a data de Brasília.
  const hoje = new Date(agora + OFFSET_MS);
  const lista = [];

  for (let d = 0; d <= DIAS_A_FRENTE; d++) {
    const dia = new Date(
      Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate() + d)
    );
    if (!DIAS_UTEIS.has(dia.getUTCDay())) continue;

    for (const [abre, fecha] of JANELAS) {
      for (let m = abre; m + DURACAO_MIN <= fecha; m += DURACAO_MIN) {
        const iso = isoBrasilia(dia.getUTCFullYear(), dia.getUTCMonth() + 1, dia.getUTCDate(), m);
        const inicio = Date.parse(iso);
        if (inicio >= minimo) {
          lista.push({ iso, inicio, fim: inicio + DURACAO_MIN * 60 * 1000 });
        }
      }
    }
  }

  return lista;
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

// Só aceita um horário que a própria agenda ofereceria agora. A ocupação é conferida
// à parte, na hora de marcar, com a agenda do Google.
export function validarHorario(texto, agora = Date.now()) {
  const ms = Date.parse(String(texto || ""));
  if (Number.isNaN(ms)) return null;
  return horariosCandidatos(agora).find((h) => h.inicio === ms) || null;
}

// Converte eventos da API do Google Agenda em intervalos ocupados.
// - cancelados e convites recusados não bloqueiam;
// - evento com horário marcado como "livre" (transparent) não bloqueia;
// - evento de dia inteiro bloqueia o dia todo, mesmo marcado como "livre" — é o jeito
//   mais simples de fechar a agenda num feriado ou numa viagem.
export function eventosParaOcupados(eventos = []) {
  const ocupados = [];

  for (const evento of eventos) {
    if (!evento || evento.status === "cancelled") continue;
    const eu = (evento.attendees || []).find((a) => a.self);
    if (eu && eu.responseStatus === "declined") continue;

    if (evento.start?.date) {
      const inicio = Date.parse(`${evento.start.date}T00:00:00${OFFSET}`);
      const fimData = evento.end?.date && Date.parse(`${evento.end.date}T00:00:00${OFFSET}`);
      if (!Number.isNaN(inicio)) ocupados.push({ inicio, fim: fimData || inicio + DIA_MS });
      continue;
    }

    if (evento.transparency === "transparent") continue;
    const inicio = Date.parse(evento.start?.dateTime || "");
    const fim = Date.parse(evento.end?.dateTime || "");
    if (!Number.isNaN(inicio) && !Number.isNaN(fim)) ocupados.push({ inicio, fim });
  }

  return ocupados;
}
