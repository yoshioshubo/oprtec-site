import { getTranslations, setRequestLocale } from "next-intl/server";
import { produtoSlugs } from "@/data/produtos";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "produtos" });
  return { title: t("metaTitle") };
}

export default async function ProdutosPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("produtos");

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-6">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        {t("badge")}
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
        {t("titulo")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">{t("subtitulo")}</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {produtoSlugs.map((slug) => {
          const tags = t.has(`items.${slug}.tags`)
            ? t.raw(`items.${slug}.tags`)
            : null;
          return (
            <div
              key={slug}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {t(`items.${slug}.nome`)}
              </h2>

              {tags && (
                <p className="mt-1 text-xs text-slate-400">{tags.join(" · ")}</p>
              )}

              <p className="mt-3 text-sm font-medium text-cyan-600">
                {t(`items.${slug}.resumo`)}
              </p>
              <p className="mt-2 flex-1 text-sm text-slate-600">
                {t(`items.${slug}.descricao`)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/avaliacao"
          className="cta-pulse inline-block rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
