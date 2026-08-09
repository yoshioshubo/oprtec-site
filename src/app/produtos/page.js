import Link from "next/link";
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
        Cada produto resolve um problema específico do dia a dia de bares e
        restaurantes. Contrate só o que faz sentido para a sua realidade agora.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {produtos.map((produto) => (
          <div
            key={produto.slug}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {produto.nome}
            </h2>
            <p className="mt-2 text-sm font-medium text-cyan-600">
              {produto.resumo}
            </p>
            <p className="mt-3 text-sm text-slate-600">{produto.descricao}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/contato"
          className="inline-block rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700"
        >
          Falar sobre o meu bar/restaurante
        </Link>
      </div>
    </div>
  );
}
