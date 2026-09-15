import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Roda em tudo, exceto arquivos estáticos, API routes e assets do Next —
  // essas rotas não têm versão traduzida e não devem ganhar prefixo de idioma.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
