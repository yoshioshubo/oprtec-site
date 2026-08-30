import { produtos } from "@/data/produtos";

export const metadata = {
  title: "Produtos — OPRtec",
};

export default function ProdutosPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        Produtos
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
        Produtos à la carte
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Cada módulo resolve um problema específico do dia a dia de bares e
        restaurantes. Os planos destravam o acesso aos módulos conforme o
        nível de maturidade da sua operação.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {produtos.map((produto) => (
          <div
            key={produto.slug}
            className={`relative flex flex-col rounded-2xl border p-6 shadow-sm ${
              produto.disponivel
                ? "border-slate-200 bg-white"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            {!produto.disponivel && (
              <span className="absolute right-4 top-4 rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Em breve
              </span>
            )}

            <h2
              className={`pr-20 text-lg font-semibold ${
                produto.disponivel ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {produto.nome}
            </h2>

            {produto.tags && (
              <p className="mt-1 text-xs text-slate-400">
                {produto.tags.join(" · ")}
              </p>
            )}

            <p
              className={`mt-3 text-sm font-medium ${
                produto.disponivel ? "text-cyan-600" : "text-slate-400"
              }`}
            >
              {produto.resumo}
            </p>
            <p
              className={`mt-2 flex-1 text-sm ${
                produto.disponivel ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {produto.descricao}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <a
          href="https://tally.so/r/yPbQ0g"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-pulse inline-block rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
        >
          Agende uma Avaliação Gratuita
        </a>
      </div>
    </div>
  );
}
