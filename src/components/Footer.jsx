import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatarWhatsApp, linkWhatsApp } from "@/lib/contato";

export default function Footer({ contatos }) {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>{t("direitos", { ano: new Date().getFullYear() })}</p>
          {contatos && (
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <a href={`mailto:${contatos.email}`} className="hover:text-slate-900">
                {contatos.email}
              </a>
              <a
                href={linkWhatsApp(contatos.whatsappNumero)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900"
              >
                WhatsApp {formatarWhatsApp(contatos.whatsappNumero)}
              </a>
            </p>
          )}
        </div>
        <div className="flex gap-6">
          <Link href="/produtos" className="hover:text-slate-900">
            {t("produtos")}
          </Link>
          <Link href="/sobre" className="hover:text-slate-900">
            {t("sobre")}
          </Link>
          <Link href="/contato" className="hover:text-slate-900">
            {t("contato")}
          </Link>
          <Link href="/termos" className="hover:text-slate-900">
            {t("termos")}
          </Link>
          <Link href="/privacidade" className="hover:text-slate-900">
            {t("privacidade")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
