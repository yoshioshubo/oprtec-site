"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import { precoTotalAnual } from "@/data/planos";

// Chave pública do Mercado Pago — segura para expor no navegador.
const PUBLIC_KEY = "APP_USR-3489eebe-ebe5-4e98-ae64-11ed2604d68f";

export default function CardCheckoutForm({ plano, ciclo = "mensal" }) {
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
    initMercadoPago(PUBLIC_KEY, { locale: "pt-BR" });
    setReady(true);
  }, []);

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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Não foi possível confirmar a assinatura.");
        setStatus("erro");
        return;
      }

      setStatus("sucesso");
      router.push("/checkout/sucesso");
    } catch {
      setErro("Não foi possível confirmar a assinatura. Tente novamente.");
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
        Carregando formulário de pagamento…
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
          Nome do estabelecimento
        </label>
        <input
          id="nomeEstabelecimento"
          type="text"
          required
          value={nomeEstabelecimento}
          onChange={(e) => setNomeEstabelecimento(e.target.value)}
          placeholder="Ex: Bacco Restaurante"
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <p className="mt-1 text-xs text-slate-400">
          Usamos esse nome para criar o acesso da sua ferramenta.
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
            Li e aceito os{" "}
            <a
              href="/termos"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-600 hover:text-cyan-700"
            >
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a
              href="/privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-600 hover:text-cyan-700"
            >
              Política de Privacidade
            </a>
            .
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={aceitouMarketing}
            onChange={(e) => setAceitouMarketing(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
          />
          <span>Quero receber ofertas e novidades da OPRtec por e-mail.</span>
        </label>
      </div>

      {!podeAssinar && (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Preencha o nome do estabelecimento e marque a caixa de aceite acima
          para liberar o formulário de pagamento.
        </div>
      )}

      {podeAssinar && status === "erro" && (
        <div className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 p-8 text-center">
          <span className="text-4xl">❌</span>
          <h2 className="mt-3 text-xl font-bold text-red-700">
            Pagamento recusado
          </h2>
          <p className="mt-2 text-base text-red-600">{erro}</p>
          <button
            type="button"
            onClick={tentarNovamente}
            className="mt-6 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {podeAssinar && status === "enviando" && (
        <div className="mt-4 rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-8 text-center">
          <span className="text-4xl">⏳</span>
          <h2 className="mt-3 text-xl font-bold text-cyan-700">
            Confirmando sua assinatura…
          </h2>
          <p className="mt-2 text-sm text-cyan-700">
            Não feche nem atualize esta página.
          </p>
        </div>
      )}

      {podeAssinar && status === "sucesso" && (
        <div className="mt-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-8 text-center">
          <span className="text-4xl">✅</span>
          <h2 className="mt-3 text-xl font-bold text-emerald-700">
            Pagamento aprovado!
          </h2>
          <p className="mt-2 text-sm text-emerald-700">
            Redirecionando…
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
              setErro(
                "O Mercado Pago não conseguiu processar os dados do cartão. Confira o número, validade e código de segurança, e tente novamente."
              );
              setStatus("erro");
            }}
          />
        </div>
      )}

      <p className="mt-4 text-center text-xs text-slate-400">
        Pagamento processado com segurança pelo Mercado Pago. Seus dados de
        cartão não passam pelo nosso servidor.
      </p>
    </div>
  );
}
