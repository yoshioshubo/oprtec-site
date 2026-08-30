import Link from "next/link";

export const metadata = {
  title: "Sobre — OPRtec",
};

const valores = [
  {
    nome: "Respeito",
    descricao: "Valorizar as pessoas, o ambiente e o tempo em cada etapa do processo.",
  },
  {
    nome: "Humildade",
    descricao: "Manter a postura de aprendiz para evoluir com a tecnologia e a prática.",
  },
  {
    nome: "Desenvolvimento",
    descricao: "Buscar o aprimoramento contínuo entre mente, método e ferramentas.",
  },
  {
    nome: "Organização",
    descricao: "Estruturar o presente para garantir consistência e clareza no futuro.",
  },
];

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
            Sobre a OPRtec
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Organização, a base para obter resultados.
          </h1>
        </div>
        <p className="max-w-md text-lg leading-8 text-justify text-slate-600 lg:justify-self-end">
          Experiência prática, método e tecnologia para transformar operações
          de alimentação em negócios mais leves, consistentes e rentáveis.
        </p>
      </section>

      <section className="mt-14 max-w-4xl border-l-2 border-cyan-500 pl-6 text-lg leading-8 text-justify text-slate-700 sm:pl-8">
        <p>
          Formado em Engenharia de Produção, com mais de 25 anos de
          experiência em gestão de empresas — passando por multinacionais e
          empreendimentos próprios —, dediquei os últimos 14 anos à área de
          alimentação fora do lar. Nesse período, acumulei uma extensa
          bagagem em reestruturação de empresas do setor: mais de 1.000
          clientes atendidos, dos mais diversos tipos, como churrascarias,
          bares, restaurantes, hamburguerias, pizzarias, comida japonesa,
          confeitarias e A&amp;B do setor hoteleiro, entre outros.
        </p>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
            O método OPR
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            O ponto de partida é colocar a casa em ordem.
          </h2>
        </div>
        <div className="space-y-4 text-justify text-slate-600">
        <p>
          Durante esse processo de aprendizagem, compreendi que a maior
          dificuldade para o alcance dos resultados pretendidos passava pela
          falta de organização de quem decide abrir ou liderar a empresa.
          Diante desse cenário, criei o método <strong>OPR</strong> —
          Organização, Processos e Resultados —, no qual a prioridade número
          1 é a organização do ambiente físico e mental das pessoas
          envolvidas na operação. De nada adianta falar de processos, fichas
          técnicas e treinamentos num ambiente onde a desorganização
          prevalece: organizar a empresa de forma metódica e disciplinada é
          a base estrutural para a implementação de processos que possam ser
          seguidos por profissionais bem treinados.
        </p>
        <p>
          Dentro do método, perseguimos não somente o resultado financeiro,
          mas também os resultados que levam à saúde e ao bem-estar dentro
          da empresa, dentro de casa e na vida social do empreendedor. Nosso
          objetivo é fazer a vida prevalecer com abundância, para que a
          empresa seja apenas a parte que o empresário possa satisfazer
          suas necessidades mundanas e não um peso a ser carregado. O uso da inteligência artificial é
          somente uma ferramenta de otimização de tempo, que permite ao
          empresário manter o foco na estratégia e no propósito de sua vida. É essencial que a organização
          e a limpeza sejam levadas a sério, pois são a base para o sucesso de qualquer empreendimento.
        </p>
        </div>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
            Visão
          </h2>
          <p className="mt-3 text-slate-700">
            Ser a principal referência em gestão integrada entre
            autoconhecimento e tecnologia, convertendo caos em ordem para
            acelerar a entrega de resultados.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
            Missão
          </h2>
          <p className="mt-3 text-slate-700">
            Reduza custos e coloque dinheiro no bolso!
          </p>
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-gradient-to-br from-cyan-50 via-slate-50 to-slate-50 p-8 sm:p-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-cyan-700 shadow-sm ring-1 ring-inset ring-cyan-200">
            Valores
          </span>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {valores.map((valor) => (
            <div
              key={valor.nome}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{valor.nome}</h3>
              <p className="mt-2 text-sm text-slate-600">{valor.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 flex flex-col gap-5 rounded-2xl bg-slate-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Próximo passo
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Sua operação pode começar a mudar hoje.
          </h2>
        </div>
        <Link
          href="/contato"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
        >
          Fale com a OPRtec <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      </section>
    </div>
  );
}
