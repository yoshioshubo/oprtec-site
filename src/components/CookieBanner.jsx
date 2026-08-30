"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "oprtec-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = window.localStorage.getItem(STORAGE_KEY);
    if (!choice) {
      setVisible(true);
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
          Usamos cookies essenciais para o funcionamento do site. Cookies
          não essenciais (como os de análise ou publicidade) só são
          ativados com o seu consentimento. Veja nossa{" "}
          <a
            href="/privacidade"
            className="font-medium text-cyan-600 hover:text-cyan-700"
          >
            Política de Privacidade
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => escolher("rejeitado")}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Rejeitar não essenciais
          </button>
          <button
            type="button"
            onClick={() => escolher("aceito")}
            className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
