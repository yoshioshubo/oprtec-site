import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroGallery from "@/components/HeroGallery";
import { Link } from "@/i18n/navigation";

const doresIds = ["cmv", "madrugada", "dre"];
const esteiraIds = ["junior", "pleno", "senior"];
const pilaresIds = ["organizacao", "processos", "resultados"];

export default async function Home({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const resultados = t.raw("resultados");

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-8 sm:pb-10 sm:pt-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              {t("heroBadge")}
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
              {t.rich("heroTitulo", {
                cyan: (chunks) => <span className="text-cyan-600">{chunks}</span>,
              })}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-600">
              {t("heroTexto")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:inline-flex sm:items-center">
              <Link
                href="/avaliacao"
                className="cta-pulse rounded-full bg-cyan-600 px-8 py-4 text-center text-lg font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700 sm:px-10"
              >
                <span className="sm:hidden">{t("ctaAvaliacaoCurto")}</span>
                <span className="hidden sm:inline">{t("ctaAvaliacao")}</span>
              </Link>
              <p className="text-center text-sm text-slate-500">
                {t("ctaMicro")}
              </p>
            </div>
          </div>

          <HeroGallery />
        </div>
      </section>

      {/* Prova: resultados obtidos */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:py-9">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              {t("resultadosLabel")}
            </p>
            <Link href="/cases" className="text-sm font-semibold text-cyan-300 hover:text-white">
              {t("resultadosLink")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:divide-x lg:divide-slate-700">
            {resultados.map((r) => (
              <div key={r.valor} className="px-1 text-center sm:px-4">
                <p className="whitespace-nowrap text-xl font-bold tracking-tight text-white sm:text-4xl lg:text-[1.75rem] xl:text-4xl">
                  {r.valor}
                </p>
                <p className="mt-2 text-sm text-slate-300 sm:text-base">{r.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agitação da dor */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            {t("dorTitulo")}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {doresIds.map((id) => (
              <div
                key={id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">
                  {t(`dores.${id}.titulo`)}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {t(`dores.${id}.descricao`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Método OPR — versão enxuta; o texto completo fica na página Sobre */}
      <section id="metodo" className="scroll-mt-24 mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
            {t("metodoBadge")}
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            {t.rich("metodoTitulo", {
              cyan: (chunks) => <span className="text-cyan-600">{chunks}</span>,
            })}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            {t("metodoIntro")}
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {pilaresIds.map((id, i) => (
            <li
              key={id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-lg font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {t(`pilares.${id}.nome`)}
              </h3>
              <p className="mt-2 text-slate-600">{t(`pilares.${id}.descricao`)}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link href="/sobre#metodo" className="font-semibold text-cyan-600 hover:text-cyan-700">
            {t("metodoLink")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Esteira de produtos */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {t("esteiraTitulo")}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {esteiraIds.map((id) => (
              <div
                key={id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">
                  {t(`esteira.${id}.nome`)}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {t(`esteira.${id}.descricao`)}
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
            {t("ctaFinalTitulo")}
          </h2>
          <Link
            href="/avaliacao"
            className="mt-8 inline-block rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
          >
            {t("ctaAvaliacao")}
          </Link>
        </div>
      </section>
    </div>
  );
}
