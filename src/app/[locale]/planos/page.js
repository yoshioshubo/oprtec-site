import { getTranslations, setRequestLocale } from "next-intl/server";
import { planos } from "@/data/planos";
import PlanosClient from "./PlanosClient";
import VendasPausadas from "@/components/VendasPausadas";
import { VENDAS_ONLINE_ATIVAS } from "@/lib/vendas";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "planos" });
  if (!VENDAS_ONLINE_ATIVAS) {
    const tv = await getTranslations({ locale, namespace: "vendasPausadas" });
    return { title: `${tv("titulo")} — OPRtec`, robots: { index: false, follow: true } };
  }
  return { title: t("metaTitle") };
}

export default async function PlanosPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!VENDAS_ONLINE_ATIVAS) return <VendasPausadas locale={locale} />;
  const t = await getTranslations("planos");

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-6">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        {t("badge")}
      </span>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
        {t("titulo")}
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-slate-600">{t("subtitulo")}</p>

      <PlanosClient planos={planos} />
    </div>
  );
}
