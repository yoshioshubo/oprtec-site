import { planos } from "@/data/planos";
import PlanosClient from "./PlanosClient";

export const metadata = {
  title: "Adquira seu Plano — OPRtec",
};

export default function PlanosPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-6">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        Planos
      </span>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
        Adquira seu plano
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-slate-600">
        Escolha o plano de acordo com o nível de maturidade da sua operação
        hoje.
      </p>

      <PlanosClient planos={planos} />
    </div>
  );
}
