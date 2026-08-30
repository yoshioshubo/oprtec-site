"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ANNUAL_DISCOUNT_PCT,
  precoMensalNoAnual,
  economiaAnual,
  funcionalidades,
  planoTemFuncao,
} from "@/data/planos";

export default function PlanosClient({ planos }) {
  const [ciclo, setCiclo] = useState("mensal");
  const anual = ciclo === "anual";

  return (
    <div>
      <div className="mt-6 flex flex-col items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
          💰 Economize {ANNUAL_DISCOUNT_PCT}% com o plano anual
        </span>

        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setCiclo("mensal")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              !anual
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => setCiclo("anual")}
            className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              anual
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Anual
            <span className="absolute -right-2 -top-3 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">
              -{ANNUAL_DISCOUNT_PCT}%
            </span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {planos.map((plano) => {
          const precoExibido = anual
            ? precoMensalNoAnual(plano.preco)
            : plano.preco;

          return (
            <div
              key={plano.slug}
              className={`relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm sm:p-7 ${
                plano.destaque
                  ? "border-cyan-500 ring-2 ring-cyan-500"
                  : "border-slate-200"
              }`}
            >
              {plano.destaque && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-600 px-3 py-1 text-xs font-semibold text-white">
                  Mais popular
                </span>
              )}

              <h2 className="text-base font-semibold text-slate-900">
                Plano {plano.nome}
              </h2>

              <div className="mt-3 flex items-baseline gap-1">
                {anual && (
                  <span className="text-sm font-medium text-slate-400 line-through">
                    R$ {plano.preco}
                  </span>
                )}
                <span className="text-sm font-medium text-slate-500">R$</span>
                <span className="text-3xl font-bold text-slate-900">
                  {precoExibido}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  /mês
                </span>
              </div>
              {anual && (
                <>
                  <p className="mt-1 text-xs text-slate-400">
                    Cobrado uma vez por ano (R$ {precoExibido * 12})
                  </p>
                  <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    Você economiza R$ {economiaAnual(plano.preco)}/ano
                  </p>
                </>
              )}

              <p className="mt-3 flex-1 text-sm text-slate-600">
                {plano.descricao}
              </p>

              <Link
                href={`/checkout?plano=${plano.slug}&ciclo=${ciclo}`}
                className={`mt-5 block rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-colors ${
                  plano.destaque
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                Quero esse plano
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-bold text-slate-900">
          O que está incluído em cada plano
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Cada nível inclui todas as funções dos níveis anteriores, além das
          suas próprias.
        </p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Função
                </th>
                {planos.map((plano) => (
                  <th
                    key={plano.slug}
                    className={`px-4 py-3 text-center font-semibold ${
                      plano.destaque ? "text-cyan-700" : "text-slate-700"
                    }`}
                  >
                    {plano.nome.replace("Maturidade ", "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {funcionalidades.map((funcao, index) => (
                <tr
                  key={funcao.nome}
                  className={
                    index % 2 === 1 ? "bg-slate-100" : "bg-white"
                  }
                >
                  <td className="px-4 py-2.5 text-slate-700">
                    {funcao.nome}
                  </td>
                  {planos.map((plano) => (
                    <td key={plano.slug} className="px-4 py-2.5 text-center">
                      {planoTemFuncao(plano.slug, funcao.nivel) ? (
                        <span
                          className="text-xl font-bold text-cyan-600"
                          aria-label="Incluído"
                        >
                          ✓
                        </span>
                      ) : (
                        <span
                          className="text-slate-300"
                          aria-label="Não incluído"
                        >
                          —
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
