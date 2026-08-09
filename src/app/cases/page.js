export const metadata = {
  title: "Cases — OPRtec",
};

const cases = [
  {
    cliente: "Confeitaria Vilamore",
    problema:
      "Ineficiência operacional por falta de organização e processos produtivos.",
    solucao:
      "Análise da curva ABC, diagnóstico de produtos que consumiam muito tempo de produção e vendiam pouco, e aplicação do método 5S para redução de tempo perdido com movimentação desnecessária.",
    resultados: [
      "8,5% de redução no CMV",
      "3 horas/dia de trabalho economizadas",
      "30% de redução no custo com mão de obra",
    ],
  },
  {
    cliente: "Pizzaria D'Anthero",
    problema: "CMV alto por falta de padronização na montagem da pizza.",
    solucao:
      "Identificação do não cumprimento das gramaturas indicadas nas fichas técnicas; implementação do pré-preparo antecipado com pesagem auditada antes do pico de movimento.",
    resultados: [
      "5,2% de redução no CMV",
      "Otimização do uso de mão de obra e mais velocidade no preparo",
      "7% de aumento nas vendas",
    ],
  },
  {
    cliente: "Cultural Bar",
    problema: "Vendas de bebidas sem cobrança, afetando o faturamento.",
    solucao: "Controle diário de contagem de bebidas com auditoria por IA.",
    resultados: ["9% de redução nas perdas com vendas sem cobrança"],
  },
  {
    cliente: "Rede Hoteleira",
    problema: "Falta de controle na entrada do café da manhã.",
    solucao:
      "Automação da criação da lista de hóspedes, permitindo controle on-line das entradas e entendimento da curva de consumo por hora.",
    resultados: [
      "11% de redução no custo de produção dos itens do café da manhã",
    ],
  },
  {
    cliente: "Hamburgueria Vulcão",
    ficticio: true,
    problema:
      "Demora no atendimento no horário de pico por falta de padronização no preparo dos lanches.",
    solucao:
      "Ficha técnica com cronometragem de etapas e reorganização da linha de montagem para reduzir deslocamento entre estações.",
    resultados: [
      "15% de redução no tempo médio de preparo",
      "6% de aumento nas vendas no horário de pico",
    ],
  },
  {
    cliente: "Cafeteria Grão & Cia",
    ficticio: true,
    problema:
      "Perda constante de insumos perecíveis por falta de controle de validade.",
    solucao:
      "Controle de estoque com alertas automáticos de vencimento e priorização de uso por ordem de entrada (PEPS).",
    resultados: ["12% de redução em perdas por vencimento de insumos"],
  },
  {
    cliente: "Choperia Barril Cheio",
    ficticio: true,
    problema:
      "Diferença entre o volume de chope comprado e o volume efetivamente vendido, sem rastreio da quebra técnica.",
    solucao:
      "Medição da quebra técnica por barril com relatório diário de perdas.",
    resultados: ["7% de redução na quebra de chope"],
  },
  {
    cliente: "Sakura Rodízio Japonês",
    ficticio: true,
    problema:
      "CMV alto por desperdício de peixe fresco comprado acima da demanda real.",
    solucao:
      "Previsão de demanda por dia da semana para ajustar o volume de compra de insumos perecíveis.",
    resultados: ["9% de redução no CMV"],
  },
  {
    cliente: "Rede Food Truck Sabor de Rua",
    ficticio: true,
    problema:
      "Cada uma das 3 unidades fechava o caixa de um jeito diferente, sem visão consolidada do negócio.",
    solucao:
      "Dashboard consolidado multiunidade com fechamento diário padronizado.",
    resultados: [
      "Fechamento das 3 unidades unificado em 1 relatório",
      "4 horas/semana economizadas na consolidação manual",
    ],
  },
  {
    cliente: "Restaurante Self-Service Sabor Caseiro",
    ficticio: true,
    problema:
      "Sobra de comida no fim do dia por falta de previsão de produção por horário de movimento.",
    solucao:
      "Modelo de previsão de consumo por dia e horário para ajustar a produção da cozinha.",
    resultados: ["18% de redução no desperdício de alimentos"],
  },
];

export default function CasesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        Cases
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
        Resultados reais
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Alguns dos negócios que já reorganizamos com o método OPR.
      </p>
      <div className="mt-12 space-y-6">
        {cases.map((c) => (
          <div
            key={c.cliente}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                {c.cliente}
              </h2>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Problema
                </p>
                <p className="mt-1 text-sm text-slate-600">{c.problema}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  O que foi feito
                </p>
                <p className="mt-1 text-sm text-slate-600">{c.solucao}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {c.resultados.map((resultado) => (
                <span
                  key={resultado}
                  className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200"
                >
                  {resultado}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
