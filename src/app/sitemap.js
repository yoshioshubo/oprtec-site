import { routing } from "@/i18n/routing";
import { VENDAS_ONLINE_ATIVAS } from "@/lib/vendas";

const SITE_URL = "https://www.oprtec.com.br";

// Páginas públicas. Checkout e administração ficam de fora de propósito (ver robots.js).
const ROTAS = [
  { caminho: "", prioridade: 1 },
  { caminho: "/produtos", prioridade: 0.9 },
  ...(VENDAS_ONLINE_ATIVAS ? [{ caminho: "/planos", prioridade: 0.9 }] : []),
  { caminho: "/avaliacao", prioridade: 0.9 },
  { caminho: "/cases", prioridade: 0.8 },
  { caminho: "/sobre", prioridade: 0.7 },
  { caminho: "/contato", prioridade: 0.7 },
  { caminho: "/termos", prioridade: 0.3 },
  { caminho: "/privacidade", prioridade: 0.3 },
];

function url(locale, caminho) {
  const prefixo = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefixo}${caminho}` || `${SITE_URL}/`;
}

// O hreflang sai aqui, no sitemap (e não em <link rel="alternate"> por página),
// porque é onde o Google aceita a lista completa sem precisar repetir a mesma
// configuração no generateMetadata de cada página.
export default function sitemap() {
  return ROTAS.map(({ caminho, prioridade }) => ({
    url: url(routing.defaultLocale, caminho),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: prioridade,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, url(locale, caminho)])
      ),
    },
  }));
}
