"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "oprtec-cookie-consent";

export default function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = window.localStorage.getItem(STORAGE_KEY);
    if (!choice) {
      const visibilityTimer = window.setTimeout(() => setVisible(true), 0);

      return () => window.clearTimeout(visibilityTimer);
    }
  }, []);

  const escolher = (valor) => {
    window.localStorage.setItem(STORAGE_KEY, valor);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 backdrop-blur sm:p-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {t.rich("texto", {
            link: (chunks) => (
              <Link
                href="/privacidade"
                className="font-medium text-cyan-600 hover:text-cyan-700"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => escolher("rejeitado")}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            {t("rejeitar")}
          </button>
          <button
            type="button"
            onClick={() => escolher("aceito")}
            className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
          >
            {t("aceitar")}
          </button>
        </div>
      </div>
    </div>
  );
}
