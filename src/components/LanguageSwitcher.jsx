"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

const IDIOMAS = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export default function LanguageSwitcher({ className = "" }) {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  // usePathname() do next-intl não inclui a query string — sem reanexar ela,
  // trocar de idioma no /checkout (que depende de ?plano=...) perdia o plano
  // escolhido e caía em "Plano não encontrado".
  const query = searchParams.toString();

  return (
    <div className={`inline-flex items-center gap-1 rounded-full border border-slate-200 p-0.5 ${className}`}>
      {IDIOMAS.map((idioma) => (
        <button
          key={idioma.code}
          type="button"
          onClick={() =>
            router.replace(
              query ? `${pathname}?${query}` : pathname,
              { locale: idioma.code }
            )
          }
          aria-current={locale === idioma.code}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            locale === idioma.code
              ? "bg-cyan-600 text-white"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {idioma.label}
        </button>
      ))}
    </div>
  );
}
