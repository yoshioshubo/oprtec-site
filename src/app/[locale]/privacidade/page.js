import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacidade" });
  return { title: t("metaTitle") };
}

const strongTag = { strong: (chunks) => <strong>{chunks}</strong> };

export default async function PrivacidadePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacidade");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        {t("badge")}
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
        {t("titulo")}
      </h1>
      <p className="mt-2 text-sm text-slate-500">{t("atualizadoEm")}</p>

      <div className="mt-10 space-y-8 text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s1Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t.rich("s1Texto", strongTag)}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s2Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t("s2Texto")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
            <li>
              <strong>{t("s2Item1Label")}</strong> {t("s2Item1Texto")}
            </li>
            <li>
              <strong>{t("s2Item2Label")}</strong> {t("s2Item2Texto")}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s3Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t("s3Texto")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s4Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t("s4Texto")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s5Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t("s5Texto")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s6Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t("s6Texto")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s7Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t("s7Texto")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s8Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t("s8Texto")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s9Titulo")}</h2>
          <p className="mt-2 leading-relaxed">
            {t.rich("s9Texto", {
              linkEmail: (chunks) => (
                <a
                  href="mailto:oprconsultorias@gmail.com"
                  className="text-cyan-600 hover:text-cyan-700"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s10Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t("s10Texto")}</p>
        </section>
      </div>
    </div>
  );
}
