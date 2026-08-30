"use client";

import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactForm() {
  const [aceitouPrivacidade, setAceitouPrivacidade] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aceitouPrivacidade) {
      alert("É necessário aceitar a Política de Privacidade para enviar.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await addDoc(collection(db, "leads"), {
        nome: formData.get("nome"),
        estabelecimento: formData.get("estabelecimento"),
        whatsapp: formData.get("whatsapp"),
        desafio: formData.get("desafio"),
        status: "novo",
        criadoEm: serverTimestamp(),
      });

      alert("Informações enviadas com sucesso!");
      form.reset();
      setAceitouPrivacidade(false);
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      alert("Ocorreu um erro ao enviar. Tente novamente.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="nome">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="estabelecimento"
        >
          Nome do estabelecimento
        </label>
        <input
          id="estabelecimento"
          name="estabelecimento"
          type="text"
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="whatsapp">
          WhatsApp
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="mensagem">
          Qual o principal desafio hoje?
        </label>
        <textarea
          id="desafio"
          name="desafio"
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
      </div>
      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={aceitouPrivacidade}
          onChange={(e) => setAceitouPrivacidade(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
        />
        <span>
          Li e aceito a{" "}
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

      <button
        type="submit"
        disabled={!aceitouPrivacidade}
        className="w-full rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Enviar
      </button>
    </form>
  );
}
