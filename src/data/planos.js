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

// Lista geral de funções. "nivel" é o plano em que a função é liberada
// pela primeira vez; planos superiores também têm acesso a ela.
export const funcionalidades = [
  { nome: "KPI Financeiro", nivel: "junior" },
  { nome: "Controle de Bebidas", nivel: "junior" },
  { nome: "Reservas", nivel: "junior" },
  { nome: "Avaliação Cliente", nivel: "junior" },
  { nome: "Controle de Contratos", nivel: "junior" },
  { nome: "Controle de Estoque", nivel: "pleno" },
  { nome: "M.O (Mão de Obra)", nivel: "pleno" },
  { nome: "DRE", nivel: "pleno" },
  { nome: "Inventário", nivel: "pleno" },
  { nome: "Calculadora de Impostos", nivel: "pleno" },
  { nome: "Conciliação Bancária", nivel: "pleno" },
  { nome: "Ficha Técnica Inteligente", nivel: "senior" },
  { nome: "Check-list", nivel: "senior" },
  { nome: "Mapa de Compras", nivel: "senior" },
  { nome: "Fluxo de Caixa", nivel: "senior" },
  { nome: "Concessionárias", nivel: "senior" },
  { nome: "Mapa de Manutenção", nivel: "senior" },
];

// Um plano tem uma função se o nível dela vier igual ou antes do próprio nível.
export function planoTemFuncao(planoSlug, funcaoNivel) {
  return (
    NIVEIS_ORDEM.indexOf(planoSlug) >= NIVEIS_ORDEM.indexOf(funcaoNivel)
  );
}

export const planos = [
  {
    slug: "junior",
    nome: "Maturidade Júnior",
    preco: 188,
    destaque: false,
    descricao:
      "Para quem está começando a organizar a operação e quer o primeiro passo com baixo atrito.",
  },
  {
    slug: "pleno",
    nome: "Maturidade Pleno",
    preco: 388,
    destaque: true,
    descricao:
      "Para quem já tem alguma estrutura e quer visibilidade completa de dados e processos.",
  },
  {
    slug: "senior",
    nome: "Maturidade Sênior",
    preco: 488,
    destaque: false,
    descricao:
      "Para quem busca subir de nível com eficiência operacional e profissionalismo de empresa grande.",
  },
];
