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
    <div className="mx-auto max-w-3xl px-6 py-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        Sobre
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
        Por trás da OPRtec
      </h1>

      <div className="mt-8 space-y-4 text-slate-600">
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
          empresa seja apenas a parte em que o ser humano possa satisfazer
          suas necessidades mundanas. O uso da inteligência artificial é
          somente uma ferramenta de otimização de tempo, que permite ao
          empresário manter o foco na estratégia e no propósito de sua vida.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
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
            Transformar a complexidade operacional em clareza, disciplina e
            resultados previsíveis.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
          Valores
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
      </div>
    </div>
  );
}
