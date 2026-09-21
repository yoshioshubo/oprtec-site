// Grade de um mês para o calendário do agendamento (semanas começando no domingo).
// Pura e em UTC — as datas "YYYY-MM-DD" já são de Brasília, então não há fuso envolvido.
export function mesesDaJanela(datas) {
  const meses = [];
  for (const data of datas) {
    const chave = data.slice(0, 7);
    if (!meses.includes(chave)) meses.push(chave);
  }
  return meses;
}

// Devolve semanas (arrays de 7) com "YYYY-MM-DD" ou null nas casas fora do mês.
export function gradeDoMes(chaveMes) {
  const [ano, mes] = chaveMes.split("-").map(Number);
  const primeiro = new Date(Date.UTC(ano, mes - 1, 1));
  const diasNoMes = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  const casas = Array(primeiro.getUTCDay()).fill(null);
  for (let d = 1; d <= diasNoMes; d++) {
    casas.push(`${chaveMes}-${String(d).padStart(2, "0")}`);
  }
  while (casas.length % 7) casas.push(null);
  const semanas = [];
  for (let i = 0; i < casas.length; i += 7) semanas.push(casas.slice(i, i + 7));
  return semanas;
}
