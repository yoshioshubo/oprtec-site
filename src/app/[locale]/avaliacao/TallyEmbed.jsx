"use client";

import Script from "next/script";
import { useTranslations } from "next-intl";
import { TALLY_FORM_ID } from "@/lib/contato";

// O aceite da Política de Privacidade (LGPD) fica DENTRO do formulário do Tally, como
// caixa obrigatória antes do botão de enviar — assim ele é gravado junto de cada resposta
// e vale também para quem abre o link direto do Tally. Não recolocar um aceite aqui fora.
//
// Só `src` (sem data-tally-src): o widget do Tally ignora iframes que tenham os dois
// atributos, e aí o formulário fica preso numa caixa de 600px com rolagem interna. A
// variante data-tally-src depende de IntersectionObserver pra carregar — com src o
// formulário aparece mesmo se o script do Tally falhar; o script só ajusta a altura.
export default function TallyEmbed({ title }) {
  const t = useTranslations("avaliacao");
  const url = `https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;

  return (
    <>
      <iframe
        src={url}
        width="100%"
        height="600"
        title={title}
        className="w-full border-0"
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
  );
}
