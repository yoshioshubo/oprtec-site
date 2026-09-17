"use client";

import Script from "next/script";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TALLY_FORM_ID } from "@/lib/contato";

// O formulário do Tally só é carregado depois do aceite da Política de Privacidade
// (LGPD): até lá nem o iframe nem o link direto existem na página, então nenhum dado
// é digitado sem o consentimento.
//
// Só `src` (sem data-tally-src): o widget do Tally ignora iframes que tenham os dois
// atributos, e aí o formulário fica preso numa caixa de 600px com rolagem interna. A
// variante data-tally-src depende de IntersectionObserver pra carregar — com src o
// formulário aparece mesmo se o script do Tally falhar; o script só ajusta a altura.
export default function TallyEmbed({ title }) {
  const t = useTranslations("avaliacao");
  const [aceitou, setAceitou] = useState(false);
  const url = `https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;

  return (
    <>
      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={aceitou}
          onChange={(e) => setAceitou(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
        />
        <span>
          {t.rich("aceito", {
            link: (chunks) => (
              <Link
                href="/privacidade"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-cyan-600 hover:text-cyan-700"
              >
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>

      {aceitou ? (
        <>
          <iframe
            src={url}
            width="100%"
            height="600"
            title={title}
            className="mt-6 w-full border-0"
          />
          <Script
            src="https://tally.so/widgets/embed.js"
            strategy="afterInteractive"
            onReady={() => window.Tally?.loadEmbeds()}
          />
          <p className="mt-4 text-center text-xs text-slate-400">
            <a
              href={`https://tally.so/r/${TALLY_FORM_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600"
            >
              {t("abrirNovaAba")}
            </a>
          </p>
        </>
      ) : (
        <p role="status" className="mt-6 rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {t("avisoAceite")}
        </p>
      )}
    </>
  );
}
