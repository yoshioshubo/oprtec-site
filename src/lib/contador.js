// Separa um texto como "+R$ 192 MM" ou "R$ 9,8 MM" em prefixo, número e sufixo, para o
// contador animado da Home subir só o número e manter o resto do texto igual.
// Separador seguido de exatamente 3 dígitos ("1.000") é tratado como milhar, não decimal.
export function separarNumero(texto) {
  const m = String(texto).match(/\d+(?:[.,]\d+)?/);
  if (!m) return null;
  const bruto = m[0];
  const sep = bruto.includes(",") ? "," : bruto.includes(".") ? "." : null;
  let casas = sep ? bruto.split(sep)[1].length : 0;
  let milhar = null;
  if (casas === 3) {
    milhar = sep;
    casas = 0;
  }
  const alvo = Number(milhar ? bruto.replace(milhar, "") : bruto.replace(",", "."));
  return {
    prefixo: texto.slice(0, m.index),
    sufixo: texto.slice(m.index + bruto.length),
    alvo,
    casas,
    sep: casas ? sep : null,
    milhar,
  };
}

export function formatarNumero(valor, { casas, sep, milhar }) {
  let s = casas ? valor.toFixed(casas) : String(Math.round(valor));
  if (casas && sep) s = s.replace(".", sep);
  if (milhar) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, milhar);
  return s;
}
