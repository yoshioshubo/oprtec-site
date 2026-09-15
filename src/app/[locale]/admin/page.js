import { setRequestLocale } from "next-intl/server";
import AdminContatos from "./AdminContatos";

export const metadata = {
  title: "Administração — OPRtec",
  robots: { index: false, follow: false },
};

// Tela interna, só em português (não usa as mensagens traduzidas do site).
export default async function AdminPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-2xl px-6 pb-20 pt-6">
      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
        Administração do site
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Contatos</h1>
      <p className="mt-2 text-slate-600">
        WhatsApp, telefone e e-mail exibidos no site. As alterações aparecem no site em até 1 minuto.
      </p>
      <AdminContatos />
    </div>
  );
}
