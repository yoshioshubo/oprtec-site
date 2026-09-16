"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Limites um pouco abaixo dos das regras do Firestore (200/200/30/2000). Sem isso, um
// texto mais longo era recusado pela regra e o visitante so via "erro ao enviar".
const LIMITES = { nome: 190, estabelecimento: 190, whatsapp: 25, desafio: 1900 };

const entrada =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500";

export default function ContactForm() {
  const t = useTranslations("contato.form");
  const [aceitouPrivacidade, setAceitouPrivacidade] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState({ tipo: "", texto: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aceitouPrivacidade) {
      setStatus({ tipo: "erro", texto: t("alertaAceite") });
      return;
    }

    const form = e.currentTarget;
    const dados = new FormData(form);
    const texto = (campo) => String(dados.get(campo) || "").trim();

    setEnviando(true);
    setStatus({ tipo: "", texto: "" });

    try {
      // Passa pela nossa rota de API (limite por IP + honeypot) em vez de gravar
      // direto no Firestore pelo navegador, que aceitava envio em massa de bot.
      const resposta = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: texto("nome"),
          estabelecimento: texto("estabelecimento"),
          whatsapp: texto("whatsapp"),
          desafio: texto("desafio"),
          site: texto("site"),
          aceitouPrivacidade: true,
        }),
      });

      if (!resposta.ok) {
        setStatus({
          tipo: "erro",
          texto: resposta.status === 429 ? t("muitasTentativas") : t("erro"),
        });
        return;
      }

      form.reset();
      setAceitouPrivacidade(false);
      setStatus({ tipo: "ok", texto: t("sucesso") });
    } catch (error) {
      console.error("Erro ao enviar o contato:", error);
      setStatus({ tipo: "erro", texto: t("erro") });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="nome">
          {t("nome")}
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          maxLength={LIMITES.nome}
          className={entrada}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="estabelecimento"
        >
          {t("estabelecimento")}
        </label>
        <input
          id="estabelecimento"
          name="estabelecimento"
          type="text"
          required
          maxLength={LIMITES.estabelecimento}
          className={entrada}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="whatsapp">
          {t("whatsapp")}
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          required
          maxLength={LIMITES.whatsapp}
          className={entrada}
        />
      </div>
      <div>
        {/* o htmlFor apontava para "mensagem", id que nao existe: clicar no rotulo nao focava o campo */}
        <label className="block text-sm font-medium text-slate-700" htmlFor="desafio">
          {t("desafio")}
        </label>
        <textarea
          id="desafio"
          name="desafio"
          rows={4}
          required
          maxLength={LIMITES.desafio}
          className={entrada}
        />
      </div>
      {/* honeypot: invisivel para gente, irresistivel para bot que preenche tudo */}
      <input
        type="text"
        name="site"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={aceitouPrivacidade}
          onChange={(e) => setAceitouPrivacidade(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
        />
        <span>
          {t.rich("aceito", {
            link: (chunks) => (
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

      {status.texto && (
        <p
          role={status.tipo === "erro" ? "alert" : "status"}
          className={`rounded-lg px-4 py-3 text-sm ${
            status.tipo === "ok"
              ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
              : "bg-red-50 text-red-800 ring-1 ring-red-200"
          }`}
        >
          {status.texto}
        </p>
      )}

      <button
        type="submit"
        disabled={!aceitouPrivacidade || enviando}
        className="w-full rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {enviando ? t("enviando") : t("enviar")}
      </button>
    </form>
  );
}
