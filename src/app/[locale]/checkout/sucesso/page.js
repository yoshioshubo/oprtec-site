import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout.sucesso" });
  return { title: t("metaTitle") };
}

export default async function SucessoPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("checkout.sucesso");

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <span className="text-5xl">🎉</span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">
        {t("titulo")}
      </h1>
      <p className="mt-4 text-slate-600">{t("texto")}</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
      >
        {t("voltar")}
      </Link>
    </div>
  );
}
