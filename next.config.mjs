import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Esconde que é Next.js no header de resposta — reduz fingerprinting trivial.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // frame-ancestors 'self' + X-Frame-Options cobrem o mesmo risco (clickjacking
          // — alguém colocando /checkout dentro de um iframe disfarçado em outro site)
          // com os dois mecanismos, porque nem todo navegador antigo lê o CSP.
          // Não restringimos script-src/connect-src aqui de propósito: o Brick do
          // Mercado Pago carrega scripts/iframes próprios dinamicamente, e uma CSP mais
          // rígida corre risco real de quebrar o checkout sem conseguirmos testar o
          // Brick de verdade neste ambiente (rede do preview local bloqueia
          // sdk.mercadopago.com).
          { key: "Content-Security-Policy", value: "frame-ancestors 'self';" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
