import { getTranslations, setRequestLocale } from "next-intl/server";
import { linkWhatsApp } from "@/lib/contato";
import { obterContatos } from "@/lib/siteConfig";
import { agendaConfigurada } from "@/lib/googleAgenda";
import TallyEmbed from "./TallyEmbed";
import AgendamentoForm from "./AgendamentoForm";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "avaliacao" });
  return { title: t("metaTitle") };
}

// Com o Google Agenda configurado no Railway, o visitante agenda direto a videoconferência
// da avaliação (AgendamentoForm). Sem as credenciais, continua o formulário do Tally embutido.
export default async function AvaliacaoPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const usarAgenda = agendaConfigurada();
  const t = await getTranslations(usarAgenda ? "agendamento" : "avaliacao");
  const tw = await getTranslations("whatsapp");
  const contatos = await obterContatos();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-6">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        {t("badge")}
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
        {t("titulo")}
      </h1>
      <p className="mt-4 text-lg text-slate-600">{t("subtitulo")}</p>
      {!usarAgenda && t("formNota") && (
        <p className="mt-2 text-sm text-slate-500">{t("formNota")}</p>
      )}

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        {usarAgenda ? <AgendamentoForm /> : <TallyEmbed title={t("titulo")} />}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <p className="text-slate-600">{t("whatsappTexto")}</p>
        <a
          href={linkWhatsApp(contatos.whatsappNumero, contatos.whatsappMensagem[locale] || tw("mensagem"))}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
        >
          {t("whatsappBotao")}
        </a>
      </div>

    </div>
  );
}
