import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Link/useRouter/redirect próprios do next-intl: já resolvem o prefixo de
// idioma certo sozinhos, então o resto do código usa esses em vez dos de
// "next/navigation" direto, sem precisar montar a URL com locale na mão.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
