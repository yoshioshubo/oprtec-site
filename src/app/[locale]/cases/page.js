import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const casesIds = [
  "confeitaria-vilamore",
  "pizzaria-danthero",
  "cultural-bar",
  "rede-hoteleira",
  "churrascaria-chimarron",
  "churrascaria-lago-sul",
  "poleiro-do-galo",
  "hamburgueria-gruta",
  "butiquim-bistro",
];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases" });
  return { title: t("metaTitle") };
}

export default async function CasesPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cases");

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-8 sm:pt-10">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        {t("badge")}
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
        {t("titulo")}
      </h1>
      <p className="mt-4 text-lg text-slate-600">{t("subtitulo")}</p>
      <div className="mt-12 space-y-6">
        {casesIds.map((id) => {
          const resultados = t.raw(`items.${id}.resultados`);
          return (
            <div
              key={id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  {t(`items.${id}.cliente`)}
                </h2>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {t("problemaLabel")}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {t(`items.${id}.problema`)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {t("solucaoLabel")}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {t(`items.${id}.solucao`)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {resultados.map((resultado) => (
                  <span
                    key={resultado}
                    className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200"
                  >
                    {resultado}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 rounded-2xl bg-slate-900 p-8 text-center text-white sm:p-10">
        <h2 className="text-2xl font-bold sm:text-3xl">{t("ctaTitulo")}</h2>
        <Link
          href="/avaliacao"
          className="cta-pulse mt-6 inline-block rounded-full bg-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
        >
          {t("ctaBotao")}
        </Link>
      </div>
    </div>
  );
}
