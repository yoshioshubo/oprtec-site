// Interruptor da venda online de planos (páginas /planos e /checkout e rota /api/assinar).
//
// false (desde 19/09/2026): as ferramentas OPRtec são oferecidas só junto com a
// consultoria presencial, com contrato assinado digitalmente. /planos e /checkout mostram
// "Fale com um consultor", ficam fora do sitemap e com noindex, e /api/assinar recusa
// qualquer tentativa de assinatura. Para voltar a vender online, basta trocar para true
// (e publicar os Termos de adesão revisados antes).
export const VENDAS_ONLINE_ATIVAS = false;
