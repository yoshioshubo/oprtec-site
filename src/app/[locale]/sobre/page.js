import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sobre" });
  return { title: t("metaTitle") };
}

export default async function SobrePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sobre");

  const valoresIds = ["respeito", "humildade", "desenvolvimento", "organizacao"];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
            {t("badge")}
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {t("titulo")}
          </h1>
        </div>
        <p className="max-w-md text-lg leading-8 text-justify text-slate-600 lg:justify-self-end">
          {t("intro")}
        </p>
      </section>

      <section className="mt-14 max-w-4xl border-l-2 border-cyan-500 pl-6 text-lg leading-8 text-justify text-slate-700 sm:pl-8">
        <p>{t("bio")}</p>
      </section>

      <section id="metodo" className="scroll-mt-24 mt-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
            {t("metodoLabel")}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {t("metodoTitulo")}
          </h2>
        </div>
        <div className="space-y-4 text-justify text-slate-600">
          <p>{t.rich("metodoP1", { strong: (chunks) => <strong>{chunks}</strong> })}</p>
          <p>{t("metodoP2")}</p>
          <p>{t("metodoP3")}</p>
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
            {t("filosofiaLabel")}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {t("filosofiaTitulo")}
          </h2>
        </div>
        <div className="space-y-4 text-justify text-slate-600">
          <blockquote className="border-l-4 border-cyan-200 pl-5 italic">
            {t("filosofiaQuote")}
          </blockquote>
          <p>{t("filosofiaP1")}</p>
          <p>{t("filosofiaP2")}</p>
          <p className="font-medium text-slate-900">{t("filosofiaP3")}</p>
          <p>
            {t.rich("filosofiaP4", {
              link: (chunks) => (
                <Link href="/avaliacao" className="font-medium text-cyan-600 hover:text-cyan-700">
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <p>{t("filosofiaP5")}</p>
          <p>
            {t.rich("filosofiaP6", {
              link: (chunks) => (
                <a
                  href="https://www.youtube.com/@yoshioshubo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-cyan-600 hover:text-cyan-700"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
            {t("visaoLabel")}
          </h2>
          <p className="mt-3 text-slate-700">{t("visaoTexto")}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
            {t("missaoLabel")}
          </h2>
          <p className="mt-3 text-slate-700">{t("missaoTexto")}</p>
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-gradient-to-br from-cyan-50 via-slate-50 to-slate-50 p-8 sm:p-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-cyan-700 shadow-sm ring-1 ring-inset ring-cyan-200">
            {t("valoresLabel")}
          </span>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {valoresIds.map((id) => (
            <div
              key={id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">
                {t(`valores.${id}.nome`)}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {t(`valores.${id}.descricao`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 flex flex-col gap-5 rounded-2xl bg-slate-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            {t("proximoPassoLabel")}
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            {t("proximoPassoTitulo")}
          </h2>
        </div>
        <Link
          href="/avaliacao"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
        >
          {t("proximoPassoBotao")} <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      </section>
    </div>
  );
}
