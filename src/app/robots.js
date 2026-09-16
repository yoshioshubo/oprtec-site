import { routing } from "@/i18n/routing";

const SITE_URL = "https://www.oprtec.com.br";

// Áreas que não devem ser indexadas, em todos os idiomas: administração, rotas de
// API e o checkout (página de transação, sem valor de busca).
const PRIVADAS = ["/admin", "/checkout"];

export default function robots() {
  const disallow = ["/api/"];
  for (const locale of routing.locales) {
    const prefixo = locale === routing.defaultLocale ? "" : `/${locale}`;
    for (const rota of PRIVADAS) disallow.push(`${prefixo}${rota}`);
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
