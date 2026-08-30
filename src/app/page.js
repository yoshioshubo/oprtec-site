import HeroGallery from "@/components/HeroGallery";

const dores = [
  {
    titulo: "CMV nas alturas",
    descricao:
      "Fichas técnicas mortas em um arquivo em excel, enquanto o seu cozinheiro vai mudando a receita pouco a pouco.",
  },
  {
    titulo: "Madrugadas fechando caixa",
    descricao:
      "O fechamento do dia consome horas da madrugada — tempo que deveria estar com a família ou descansando.",
  },
  {
    titulo: "Sem DRE atualizado",
    descricao:
      "Decisões tomadas no feeling, porque o DRE só aparece (quando aparece) semanas depois do fechamento do mês.",
  },
];

const esteira = [
  {
    nivel: "1",
    nome: "Nível Maturidade Júnior",
    descricao:
      "É o momento de tirar a empresa do piloto automático. Você começa a enxergar o negócio com clareza, dá o primeiro passo para transformar a intuição em método e planta as bases de uma operação que vai além da correria do dia a dia.",
  },
  {
    nivel: "2",
    nome: "Nível Maturidade Pleno",
    descricao:
      "A casa já está em ordem e agora é hora de ganhar profundidade. Você passa a acompanhar de perto cada engrenagem do negócio, antecipa problemas antes que virem prejuízo e conduz a operação com confiança, não mais no improviso.",
  },
  {
    nivel: "3",
    nome: "Nível Maturidade Sênior",
    descricao:
      "Sua empresa opera com a precisão de um negócio grande de verdade. Processos rodam sozinhos, decisões são tomadas com dado na mão, e você finalmente tem tempo e liberdade para pensar estratégia — não só apagar incêndio.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-8 sm:pb-28 sm:pt-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Para bares e restaurantes que buscam resultados reais.
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              <span className="text-cyan-600">ORGANIZE</span> o seu
              restaurante e comece a ver a cor do{" "}
              <span className="text-cyan-600">DINHEIRO</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-600">
              Converta o caos do dia a dia em resultados previsíveis. Nossa
              tecnologia atua direto na organização e nos processos do seu
              negócio, sem exigir que você seja um especialista.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://tally.so/r/yPbQ0g"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-pulse rounded-full bg-cyan-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
              >
                Agende uma Avaliação Gratuita
              </a>
              <a
                href="#metodo"
                className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Como funciona o método
              </a>
            </div>
          </div>

          <HeroGallery />
        </div>
      </section>

      {/* Agitação da dor */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            Sua cozinha funciona, mas o dinheiro não sobra?
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {dores.map((dor) => (
              <div
                key={dor.titulo}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">{dor.titulo}</h3>
                <p className="mt-2 text-sm text-slate-600">{dor.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Método OPR */}
      <section id="metodo" className="mx-auto max-w-4xl px-6 py-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
          Método OPR
        </span>
        <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          Organização, Processos e Resultados.
        </h2>

        <blockquote className="mt-6 border-l-4 border-cyan-200 pl-6 text-lg italic text-slate-600">
          Como escreveu Friedrich Nietzsche, "Quem tem um porquê enfrenta qualquer como". O nosso método vai além da tecnologia com IA e permeia a filosofia estoica, levando o empresário à compreensão de seu propósito e do porquê de fazer o que deve ser feito.
        </blockquote>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-slate-600">
          <p>
            A desordem física de uma operação é, antes de tudo, um reflexo do caos que prevalece na mente de quem a lidera. Somente em um ambiente organizado com propósito e energia é possível sustentar processos que realmente elevem a produtividade.
          </p>
          <p>
            O Método OPR integra a filosofia de trabalho do 5S para colocar pessoas e ambiente em total sintonia. A Inteligência Artificial e as ferramentas tecnológicas avançadas só prosperam quando essa harmonia já está estabelecida.
          </p>
          <p className="font-medium text-slate-900">
            É como preparar a terra: se o solo for inapropriado, nem a melhor semente do mundo vinga. Nós preparamos o seu terreno para o crescimento.
          </p>
          <p>
            Na OPRtec, acreditamos que cada negócio tem seu tempo. Ao
            preencher o diagnóstico{" "}
            <a
              href="https://tally.so/r/yPbQ0g"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-600 hover:text-cyan-700"
            >
              &ldquo;Agende uma Avaliação Gratuita&rdquo;
            </a>
            , identificamos o nível de maturidade da sua empresa para
            direcionar exatamente as soluções que você precisa agora. Nosso
            compromisso é com o seu resultado prático: não vendemos
            ferramentas que a sua operação ainda não tem estrutura para
            absorver.
          </p>
          <p>
            Dividimos a jornada empresarial em três estágios: Júnior, Pleno e
            Sênior. Cada nível destrava o acesso a um conjunto específico de
            soluções.
          </p>
          <p>
            Se o seu objetivo é estruturar a sua organização e subir de
            nível, oferecemos consultoria personalizada para preparar o
            terreno para o seu crescimento. E para continuarmos guiando sua
            jornada, confira nossos vídeos no YouTube{" "}
            <a
              href="https://www.youtube.com/@yoshioshubo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-600 hover:text-cyan-700"
            >
              @yoshioshubo
            </a>{" "}
            com reflexões e estratégias práticas que norteiam a rotina de
            quem empreende.
          </p>
        </div>
      </section>

      {/* Esteira de produtos */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Uma esteira de soluções, do primeiro passo à gestão completa
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {esteira.map((item) => (
              <div
                key={item.nivel}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">
                  {item.nome}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {item.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Descubra qual solução é ideal para o seu momento.
          </h2>
          <a
            href="https://tally.so/r/yPbQ0g"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
          >
            Agende uma Avaliação Gratuita
          </a>
        </div>
      </section>
    </div>
  );
}
