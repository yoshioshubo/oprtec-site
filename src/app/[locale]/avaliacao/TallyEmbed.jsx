"use client";

import Script from "next/script";
import { TALLY_FORM_ID } from "@/lib/contato";

// Só `src` (sem data-tally-src): o widget do Tally ignora iframes que tenham os dois
// atributos, e aí o formulário fica preso numa caixa de 600px com rolagem interna. A
// variante data-tally-src depende de IntersectionObserver pra carregar — com src o
// formulário aparece mesmo se o script do Tally falhar; o script só ajusta a altura.
export default function TallyEmbed({ title }) {
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
    </>
  );
}
