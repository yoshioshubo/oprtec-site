"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

// LanguageSwitcher usa useSearchParams() (pra preservar ?plano=... ao trocar de
// idioma no checkout) — isso exige um limite de Suspense na geração estática,
// senão o build quebra em toda página pré-renderizada.
function LanguageSwitcherFallback({ className }) {
  return <div className={`h-[26px] w-[92px] ${className || ""}`} />;
}

export default function Header() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("inicio") },
    { href: "/#metodo", label: t("metodo") },
    { href: "/produtos", label: t("produtos") },
    { href: "/sobre", label: t("sobre") },
    { href: "/cases", label: t("cases") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="OPRtec"
            width={1198}
            height={492}
            className="h-[45.6px] w-auto"
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          <nav className="flex gap-6 xl:gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[16.8px] font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Suspense fallback={<LanguageSwitcherFallback />}>
            <LanguageSwitcher />
          </Suspense>
          <Link
            href="/avaliacao"
            className="whitespace-nowrap rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
          >
            {t("cta")}
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Suspense fallback={<LanguageSwitcherFallback />}>
            <LanguageSwitcher />
          </Suspense>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-slate-700"
            aria-label={t("abrirMenu")}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-slate-200 px-6 py-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/avaliacao"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-cyan-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-cyan-700"
          >
            {t("cta")}
          </Link>
        </nav>
      )}
    </header>
  );
}
