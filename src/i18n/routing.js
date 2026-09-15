import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en", "es"],
  defaultLocale: "pt",
  // Português fica na raiz (oprtec.com.br/produtos), sem prefixo /pt — só
  // inglês e espanhol ganham prefixo na URL (/en/produtos, /es/produtos).
  localePrefix: "as-needed",
});
