export const ANNUAL_DISCOUNT_PCT = 28;

// Preço mensal equivalente quando cobrado anualmente (28% de desconto).
export function precoMensalNoAnual(precoMensal) {
  return Math.round(precoMensal * (1 - ANNUAL_DISCOUNT_PCT / 100));
}

// Valor total cobrado de uma vez no plano anual.
export function precoTotalAnual(precoMensal) {
  return precoMensalNoAnual(precoMensal) * 12;
}

// Quanto se economiza em reais por ano ao escolher o plano anual.
export function economiaAnual(precoMensal) {
  return precoMensal * 12 - precoTotalAnual(precoMensal);
}

// Ordem de nível: cada plano herda as funções de todos os níveis anteriores.
export const NIVEIS_ORDEM = ["junior", "pleno", "senior"];

// Lista geral de funções (id + nível em que é liberada). O nome exibido vive
// em messages/{locale}.json, namespace "planos.funcionalidades".
export const funcionalidades = [
  { id: "kpi-financeiro", nivel: "junior" },
  { id: "controle-bebidas", nivel: "junior" },
  { id: "reservas", nivel: "junior" },
  { id: "avaliacao-cliente", nivel: "junior" },
  { id: "controle-contratos", nivel: "junior" },
  { id: "controle-estoque", nivel: "pleno" },
  { id: "mao-de-obra", nivel: "pleno" },
  { id: "dre", nivel: "pleno" },
  { id: "inventario", nivel: "pleno" },
  { id: "calculadora-impostos", nivel: "pleno" },
  { id: "conciliacao-bancaria", nivel: "pleno" },
  { id: "ficha-tecnica-inteligente", nivel: "senior" },
  { id: "checklist", nivel: "senior" },
  { id: "mapa-compras", nivel: "senior" },
  { id: "fluxo-caixa", nivel: "senior" },
  { id: "concessionarias", nivel: "senior" },
  { id: "mapa-manutencao", nivel: "senior" },
];

// Um plano tem uma função se o nível dela vier igual ou antes do próprio nível.
export function planoTemFuncao(planoSlug, funcaoNivel) {
  return (
    NIVEIS_ORDEM.indexOf(planoSlug) >= NIVEIS_ORDEM.indexOf(funcaoNivel)
  );
}

// Só a estrutura (slug/preço/destaque) — nome e descrição vivem em
// messages/{locale}.json, namespace "planos.items".
export const planos = [
  { slug: "junior", preco: 188, destaque: false },
  { slug: "pleno", preco: 388, destaque: true },
  { slug: "senior", preco: 488, destaque: false },
];
