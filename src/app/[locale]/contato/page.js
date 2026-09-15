import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactForm from "./ContactForm";
import { formatarWhatsApp, linkWhatsApp } from "@/lib/contato";
import { obterContatos } from "@/lib/siteConfig";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contato" });
  return { title: t("metaTitle") };
}

export default async function ContatoPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contato");
  const tw = await getTranslations("whatsapp");
  const contatos = await obterContatos();

  return (
    <div className="mx-auto max-w-xl px-6 py-6">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        {t("badge")}
      </span>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
        {t("titulo")}
      </h1>
      <p className="mt-3 text-lg text-slate-600">{t("subtitulo")}</p>

      <ContactForm />

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <p className="font-semibold text-slate-900">{t("canaisTitulo")}</p>
        <ul className="mt-3 space-y-2 text-slate-600">
          <li>
            <span className="text-slate-400">{t("canalWhatsapp")}: </span>
            <a
              href={linkWhatsApp(contatos.whatsappNumero, contatos.whatsappMensagem[locale] || tw("mensagem"))}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-600 hover:text-cyan-700"
            >
              {formatarWhatsApp(contatos.whatsappNumero)}
            </a>
          </li>
          {contatos.telefone && (
            <li>
              <span className="text-slate-400">{t("canalTelefone")}: </span>
              <a href={`tel:+55${contatos.telefone.replace(/\D/g, "")}`} className="font-medium text-slate-700">
                {contatos.telefone}
              </a>
            </li>
          )}
          <li>
            <span className="text-slate-400">{t("canalEmail")}: </span>
            <a href={`mailto:${contatos.email}`} className="font-medium text-cyan-600 hover:text-cyan-700">
              {contatos.email}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
