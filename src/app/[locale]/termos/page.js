import { getTranslations, setRequestLocale } from "next-intl/server";
import { VENDAS_ONLINE_ATIVAS } from "@/lib/vendas";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termos" });
  return { title: t("metaTitle") };
}

const strongTag = { strong: (chunks) => <strong>{chunks}</strong> };

export default async function TermosPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("termos");

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
          <p className="mt-2 leading-relaxed">
            {t.rich("s2Texto", {
              linkProdutos: (chunks) => (
                <Link href="/produtos" className="text-cyan-600 hover:text-cyan-700">
                  {chunks}
                </Link>
              ),
              linkPlanos: (chunks) =>
                VENDAS_ONLINE_ATIVAS ? (
                  <Link href="/planos" className="text-cyan-600 hover:text-cyan-700">
                    {chunks}
                  </Link>
                ) : (
                  chunks
                ),
            })}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s3Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t.rich("s3TextoA", strongTag)}</p>
          <p className="mt-2 leading-relaxed">{t("s3TextoB")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s4Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t("s4Texto")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s5Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t.rich("s5TextoA", strongTag)}</p>
          <p className="mt-2 leading-relaxed">{t("s5TextoB")}</p>
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
          <p className="mt-2 leading-relaxed">{t("s9Texto")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s10Titulo")}</h2>
          <p className="mt-2 leading-relaxed">{t("s10Texto")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">{t("s11Titulo")}</h2>
          <p className="mt-2 leading-relaxed">
            {t.rich("s11Texto", {
              linkEmail: (chunks) => (
                <a
                  href="mailto:oprconsultorias@gmail.com"
                  className="text-cyan-600 hover:text-cyan-700"
                >
                  {chunks}
                </a>
              ),
              linkContato: (chunks) => (
                <Link href="/contato" className="text-cyan-600 hover:text-cyan-700">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </section>
      </div>
    </div>
  );
}
