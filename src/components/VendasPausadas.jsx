import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { linkWhatsApp } from "@/lib/contato";
import { obterContatos } from "@/lib/siteConfig";

// Mostrada em /planos e /checkout enquanto VENDAS_ONLINE_ATIVAS for false (src/lib/vendas.js).
export default async function VendasPausadas({ locale }) {
  const t = await getTranslations("vendasPausadas");
  const tw = await getTranslations("whatsapp");
  const contatos = await obterContatos();

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        {t("badge")}
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{t("titulo")}</h1>
      <p className="mt-4 text-lg text-slate-600">{t("texto")}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={linkWhatsApp(contatos.whatsappNumero, contatos.whatsappMensagem[locale] || tw("mensagem"))}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-cyan-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
        >
          {t("whatsapp")}
        </a>
        <Link
          href="/avaliacao"
          className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
        >
          {t("avaliacao")}
        </Link>
      </div>
    </div>
  );
}
