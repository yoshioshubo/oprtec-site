"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Antes, um endereco inexistente caia na tela padrao do Next: em ingles, sem cabecalho,
// rodape nem caminho de volta. Como renderiza dentro do layout de [locale], esta ja vem
// no idioma do visitante.
export default function NaoEncontrado() {
  const t = useTranslations("naoEncontrado");

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">404</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">{t("titulo")}</h1>
      <p className="mt-4 text-slate-600">{t("texto")}</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
        >
          {t("voltar")}
        </Link>
        <Link
          href="/contato"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          {t("contato")}
        </Link>
      </div>
    </div>
  );
}
