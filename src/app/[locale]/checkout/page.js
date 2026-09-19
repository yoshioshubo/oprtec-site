import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  planos,
  precoMensalNoAnual,
  precoTotalAnual,
  economiaAnual,
} from "@/data/planos";
import CardCheckoutForm from "./CardCheckoutForm";
import VendasPausadas from "@/components/VendasPausadas";
import { VENDAS_ONLINE_ATIVAS } from "@/lib/vendas";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return { title: t("metaTitle"), ...(VENDAS_ONLINE_ATIVAS ? {} : { robots: { index: false, follow: true } }) };
}

const TRIAL_DAYS = 10;

export default async function CheckoutPage({ params, searchParams }) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!VENDAS_ONLINE_ATIVAS) return <VendasPausadas locale={locale} />;
  const t = await getTranslations("checkout");

  const { plano: slug, ciclo: cicloParam } = await searchParams;
  const ciclo = cicloParam === "anual" ? "anual" : "mensal";
  const anual = ciclo === "anual";
  const plano = planos.find((p) => p.slug === slug);

  if (!plano) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          {t("planoNaoEncontradoTitulo")}
        </h1>
        <p className="mt-4 text-slate-600">{t("planoNaoEncontradoTexto")}</p>
        <Link
          href="/planos"
          className="mt-8 inline-block rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
        >
          {t("verPlanos")}
        </Link>
      </div>
    );
  }

  const tPlanos = await getTranslations("planos");

  return (
    <div className="mx-auto max-w-lg px-6 py-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        {t("badge")}
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">
        {t("tituloPlano", { nome: tPlanos(`items.${plano.slug}.nome`) })}
      </h1>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-inset ring-cyan-200">
            {t("diasGratis", { dias: TRIAL_DAYS })}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
            {anual ? t("cobrancaAnual") : t("cobrancaMensal")}
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
                {t("porMesAposTeste")}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {t("cobrancaUnica", { valor: precoTotalAnual(plano.preco) })}
            </p>
            <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              {t("voceEconomiza", { valor: economiaAnual(plano.preco) })}
            </p>
          </div>
        ) : (
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-sm font-medium text-slate-500">R$</span>
            <span className="text-4xl font-bold text-slate-900">
              {plano.preco}
            </span>
            <span className="text-sm font-medium text-slate-500">
              {t("porMesAposTeste")}
            </span>
          </div>
        )}
        <p className="mt-2 text-sm text-slate-600">
          {tPlanos(`items.${plano.slug}.descricao`)}
        </p>
      </div>

      <p className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        {t("avisoTeste", { dias: TRIAL_DAYS })}
      </p>

      <p className="mt-3 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        {t.rich("avisoArrependimento", {
          strong: (chunks) => <strong>{chunks}</strong>,
          link: (chunks) => (
            <Link
              href="/termos"
              className="font-medium text-cyan-600 hover:text-cyan-700"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>

      <CardCheckoutForm plano={plano} ciclo={ciclo} />
    </div>
  );
}
