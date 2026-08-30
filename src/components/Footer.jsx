import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} OPRtec — Organização, Processos e Resultados.</p>
        <div className="flex gap-6">
          <Link href="/produtos" className="hover:text-slate-900">
            Produtos
          </Link>
          <Link href="/sobre" className="hover:text-slate-900">
            Sobre
          </Link>
          <Link href="/contato" className="hover:text-slate-900">
            Contato
          </Link>
          <Link href="/termos" className="hover:text-slate-900">
            Termos de Uso
          </Link>
          <Link href="/privacidade" className="hover:text-slate-900">
            Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
