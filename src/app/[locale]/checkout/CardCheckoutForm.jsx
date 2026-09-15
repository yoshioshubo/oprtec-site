"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import { precoTotalAnual } from "@/data/planos";

// Chave pública do Mercado Pago — segura para expor no navegador.
const PUBLIC_KEY = "APP_USR-3489eebe-ebe5-4e98-ae64-11ed2604d68f";

export default function CardCheckoutForm({ plano, ciclo = "mensal" }) {
  const t = useTranslations("checkout");
  const tForm = useTranslations("checkout.form");
  const locale = useLocale();
  const mpLocale = t("mpLocale");
  const router = useRouter();
  const valorCobrado =
    ciclo === "anual" ? precoTotalAnual(plano.preco) : plano.preco;
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("idle");
  const [erro, setErro] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [aceitouMarketing, setAceitouMarketing] = useState(false);
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState("");
  const podeAssinar = aceitouTermos && nomeEstabelecimento.trim().length > 0;

  useEffect(() => {
    initMercadoPago(PUBLIC_KEY, { locale: mpLocale });
    const readyTimer = window.setTimeout(() => setReady(true), 0);

    return () => window.clearTimeout(readyTimer);
  }, [mpLocale]);

  const handleSubmit = async (formData) => {
    setStatus("enviando");
    setErro("");

    try {
      const res = await fetch("/api/assinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plano: plano.slug,
          ciclo,
          cardTokenId: formData.token,
          email: formData.payer.email,
          nomeEstabelecimento,
          aceitouTermos,
          aceitouMarketing,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || tForm("erroGenerico"));
        setStatus("erro");
        return;
      }

      setStatus("sucesso");
      router.push("/checkout/sucesso");
    } catch {
      setErro(tForm("erroCatch"));
      setStatus("erro");
    }
  };

  const tentarNovamente = () => {
    setStatus("idle");
    setErro("");
    setFormKey((k) => k + 1);
  };

  if (!ready) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
        {tForm("carregando")}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="nomeEstabelecimento"
        >
          {tForm("nomeEstabelecimento")}
        </label>
        <input
          id="nomeEstabelecimento"
          type="text"
          required
          value={nomeEstabelecimento}
          onChange={(e) => setNomeEstabelecimento(e.target.value)}
          placeholder={tForm("nomeEstabelecimentoPlaceholder")}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <p className="mt-1 text-xs text-slate-400">
          {tForm("nomeEstabelecimentoAjuda")}
        </p>
      </div>

      <div className="mt-3 space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={aceitouTermos}
            onChange={(e) => setAceitouTermos(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
          />
          <span>
            {tForm.rich("aceito", {
              linkTermos: (chunks) => (
                <Link
                  href="/termos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-cyan-600 hover:text-cyan-700"
                >
                  {chunks}
                </Link>
              ),
              linkPrivacidade: (chunks) => (
                <Link
                  href="/privacidade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-cyan-600 hover:text-cyan-700"
                >
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={aceitouMarketing}
            onChange={(e) => setAceitouMarketing(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
          />
          <span>{tForm("marketing")}</span>
        </label>
      </div>

      {!podeAssinar && (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          {tForm("preenchaAntes")}
        </div>
      )}

      {podeAssinar && status === "erro" && (
        <div className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 p-8 text-center">
          <span className="text-4xl">❌</span>
          <h2 className="mt-3 text-xl font-bold text-red-700">
            {tForm("recusadoTitulo")}
          </h2>
          <p className="mt-2 text-base text-red-600">{erro}</p>
          <button
            type="button"
            onClick={tentarNovamente}
            className="mt-6 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            {tForm("tentarNovamente")}
          </button>
        </div>
      )}

      {podeAssinar && status === "enviando" && (
        <div className="mt-4 rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-8 text-center">
          <span className="text-4xl">⏳</span>
          <h2 className="mt-3 text-xl font-bold text-cyan-700">
            {tForm("confirmandoTitulo")}
          </h2>
          <p className="mt-2 text-sm text-cyan-700">
            {tForm("confirmandoTexto")}
          </p>
        </div>
      )}

      {podeAssinar && status === "sucesso" && (
        <div className="mt-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-8 text-center">
          <span className="text-4xl">✅</span>
          <h2 className="mt-3 text-xl font-bold text-emerald-700">
            {tForm("aprovadoTitulo")}
          </h2>
          <p className="mt-2 text-sm text-emerald-700">
            {tForm("redirecionando")}
          </p>
        </div>
      )}

      {podeAssinar && (status === "idle" || status === "enviando") && (
        <div className={status === "enviando" ? "hidden" : "mt-4"}>
          <CardPayment
            key={formKey}
            initialization={{ amount: valorCobrado }}
            customization={{
              visual: { hideFormTitle: true, hidePaymentButton: false },
              paymentMethods: { minInstallments: 1, maxInstallments: 1 },
            }}
            onSubmit={handleSubmit}
            onError={(err) => {
              // Erro do próprio Brick (ex: cartão recusado na validação, antes de
              // chegar no nosso onSubmit) — sem isso, o Brick fica preso mostrando a
              // mensagem genérica dele pra sempre, sem nenhum jeito de tentar de novo.
              console.error("Erro no formulário de cartão:", err);
              setErro(tForm("erroBrick"));
              setStatus("erro");
            }}
          />
        </div>
      )}

      <p className="mt-4 text-center text-xs text-slate-400">
        {tForm("seguranca")}
      </p>
    </div>
  );
}
