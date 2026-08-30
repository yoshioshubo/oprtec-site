import Link from "next/link";

export const metadata = {
  title: "Assinatura confirmada — OPRtec",
};

export default function SucessoPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <span className="text-5xl">🎉</span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">
        Assinatura confirmada!
      </h1>
      <p className="mt-4 text-slate-600">
        Recebemos os dados do seu pagamento. Em breve entraremos em contato
        pra começar a configurar seu plano na OPRtec.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
