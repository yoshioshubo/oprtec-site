import Link from "next/link";
import {
  planos,
  precoMensalNoAnual,
  precoTotalAnual,
  economiaAnual,
} from "@/data/planos";
import CardCheckoutForm from "./CardCheckoutForm";

export const metadata = {
  title: "Finalizar assinatura — OPRtec",
};

const TRIAL_DAYS = 10;

export default async function CheckoutPage({ searchParams }) {
  const { plano: slug, ciclo: cicloParam } = await searchParams;
  const ciclo = cicloParam === "anual" ? "anual" : "mensal";
  const anual = ciclo === "anual";
  const plano = planos.find((p) => p.slug === slug);

  if (!plano) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Plano não encontrado
        </h1>
        <p className="mt-4 text-slate-600">
          Volta pra página de planos e escolhe uma das opções disponíveis.
        </p>
        <Link
          href="/planos"
          className="mt-8 inline-block rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
        >
          Ver planos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        Finalizar assinatura
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">
        Plano {plano.nome}
      </h1>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-inset ring-cyan-200">
            {TRIAL_DAYS} dias grátis
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
            {anual ? "Cobrança anual" : "Cobrança mensal"}
          </span>
        </div>

        {anual ? (
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-slate-400 line-through">
                R$ {plano.preco}
              </span>
              <span className="text-sm font-medium text-slate-500">R$</span>
              <span className="text-4xl font-bold text-slate-900">
                {precoMensalNoAnual(plano.preco)}
              </span>
              <span className="text-sm font-medium text-slate-500">
                /mês após o período de teste
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Cobrança única à vista no cartão de crédito: R${" "}
              {precoTotalAnual(plano.preco)} (não é parcelado)
            </p>
            <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              Você economiza R$ {economiaAnual(plano.preco)}/ano
            </p>
          </div>
        ) : (
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-sm font-medium text-slate-500">R$</span>
            <span className="text-4xl font-bold text-slate-900">
              {plano.preco}
            </span>
            <span className="text-sm font-medium text-slate-500">
              /mês após o período de teste
            </span>
          </div>
        )}
        <p className="mt-2 text-sm text-slate-600">{plano.descricao}</p>
      </div>

      <p className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        Seu cartão será validado agora, mas você só será cobrado após{" "}
        {TRIAL_DAYS} dias. Se não quiser continuar, cancele antes do fim do
        período de teste — a cobrança é automática caso a assinatura não
        seja cancelada até lá.
      </p>

      <p className="mt-3 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        Você tem <strong>7 dias corridos</strong> após a contratação para
        desistir e pedir reembolso integral, sem precisar justificar
        (direito de arrependimento previsto no Art. 49 do Código de Defesa
        do Consumidor). Veja os detalhes nos{" "}
        <a href="/termos" className="font-medium text-cyan-600 hover:text-cyan-700">
          Termos de Uso
        </a>
        .
      </p>

      <CardCheckoutForm plano={plano} ciclo={ciclo} />
    </div>
  );
}
