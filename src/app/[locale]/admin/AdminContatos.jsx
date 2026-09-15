"use client";

import { useEffect, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import {
  ADMINS,
  CONTATOS_PADRAO,
  formatarWhatsApp,
  linkWhatsApp,
  normalizarWhatsApp,
} from "@/lib/contato";

const MENSAGEM_PADRAO = {
  pt: "Olá! Vim pelo site da OPRtec e gostaria de saber mais.",
  en: "Hi! I found OPRtec's website and would like to know more.",
  es: "¡Hola! Vi el sitio de OPRtec y me gustaría saber más.",
};

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const campo =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100";

export default function AdminContatos() {
  const [usuario, setUsuario] = useState(undefined); // undefined = verificando sessão
  const [form, setForm] = useState(null);
  const [atualizado, setAtualizado] = useState(null);
  const [status, setStatus] = useState({ tipo: "", texto: "" });
  const [salvando, setSalvando] = useState(false);

  const autorizado = usuario && usuario.emailVerified && ADMINS.includes(usuario.email);

  useEffect(() => onAuthStateChanged(auth, setUsuario), []);

  useEffect(() => {
    if (!autorizado) return;
    getDoc(doc(db, "siteConfig", "contatos"))
      .then((snap) => {
        const d = snap.exists() ? snap.data() : {};
        setForm({
          whatsapp: formatarWhatsApp(d.whatsappNumero || CONTATOS_PADRAO.whatsappNumero),
          mensagemPt: d.whatsappMensagem?.pt || MENSAGEM_PADRAO.pt,
          mensagemEn: d.whatsappMensagem?.en || MENSAGEM_PADRAO.en,
          mensagemEs: d.whatsappMensagem?.es || MENSAGEM_PADRAO.es,
          telefone: d.telefone ?? CONTATOS_PADRAO.telefone,
          email: d.email || CONTATOS_PADRAO.email,
        });
        if (d.atualizadoEm) {
          setAtualizado({ em: d.atualizadoEm.toDate(), por: d.atualizadoPor });
        }
      })
      .catch((e) => {
        console.error(e);
        setStatus({ tipo: "erro", texto: "Não foi possível carregar os dados. Verifique se as regras do Firestore foram publicadas." });
        setForm({
          whatsapp: formatarWhatsApp(CONTATOS_PADRAO.whatsappNumero),
          mensagemPt: MENSAGEM_PADRAO.pt,
          mensagemEn: MENSAGEM_PADRAO.en,
          mensagemEs: MENSAGEM_PADRAO.es,
          telefone: CONTATOS_PADRAO.telefone,
          email: CONTATOS_PADRAO.email,
        });
      });
  }, [autorizado]);

  const entrar = async () => {
    setStatus({ tipo: "", texto: "" });
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") {
        console.error(e);
        setStatus({ tipo: "erro", texto: `Não foi possível entrar (${e.code || "erro"}).` });
      }
    }
  };

  const alterar = (nome) => (e) => {
    setForm((f) => ({ ...f, [nome]: e.target.value }));
    setStatus({ tipo: "", texto: "" });
  };

  const salvar = async (e) => {
    e.preventDefault();
    const numero = normalizarWhatsApp(form.whatsapp);
    if (!numero) {
      setStatus({ tipo: "erro", texto: "WhatsApp inválido. Use DDD + número, ex.: (32) 99185-2108." });
      return;
    }
    if (!EMAIL_VALIDO.test(form.email.trim())) {
      setStatus({ tipo: "erro", texto: "E-mail inválido." });
      return;
    }
    setSalvando(true);
    try {
      await setDoc(doc(db, "siteConfig", "contatos"), {
        whatsappNumero: numero,
        whatsappMensagem: {
          pt: form.mensagemPt.trim(),
          en: form.mensagemEn.trim(),
          es: form.mensagemEs.trim(),
        },
        telefone: form.telefone.trim(),
        email: form.email.trim(),
        atualizadoEm: serverTimestamp(),
        atualizadoPor: usuario.email,
      });
      setForm((f) => ({ ...f, whatsapp: formatarWhatsApp(numero) }));
      setAtualizado({ em: new Date(), por: usuario.email });
      setStatus({ tipo: "ok", texto: "Salvo! O site atualiza em até 1 minuto." });
    } catch (err) {
      console.error(err);
      setStatus({
        tipo: "erro",
        texto:
          err.code === "permission-denied"
            ? "Sem permissão para salvar. Confira se as regras do Firestore foram publicadas."
            : "Erro ao salvar. Tente novamente.",
      });
    } finally {
      setSalvando(false);
    }
  };

  const aviso =
    status.texto &&
    (
      <p
        className={`mt-6 rounded-lg px-4 py-3 text-sm ${
          status.tipo === "ok"
            ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
            : "bg-red-50 text-red-800 ring-1 ring-red-200"
        }`}
      >
        {status.texto}
      </p>
    );

  if (usuario === undefined) {
    return <p className="mt-10 text-slate-500">Carregando…</p>;
  }

  if (!usuario) {
    return (
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-600">Entre com uma conta Google autorizada.</p>
        <button
          type="button"
          onClick={entrar}
          className="mt-5 rounded-full bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700"
        >
          Entrar com Google
        </button>
        {aviso}
      </div>
    );
  }

  if (!autorizado) {
    return (
      <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-800">
          A conta <strong>{usuario.email}</strong> não tem acesso à administração.
        </p>
        <button
          type="button"
          onClick={() => signOut(auth)}
          className="mt-5 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Sair e usar outra conta
        </button>
      </div>
    );
  }

  if (!form) {
    return <p className="mt-10 text-slate-500">Carregando dados…</p>;
  }

  const numeroValido = normalizarWhatsApp(form.whatsapp);

  return (
    <form onSubmit={salvar} className="mt-8 space-y-8">
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <span>
          Conectado como <strong>{usuario.email}</strong>
        </span>
        <button type="button" onClick={() => signOut(auth)} className="font-medium text-cyan-600 hover:text-cyan-700">
          Sair
        </button>
      </div>

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <legend className="px-2 font-semibold text-slate-900">WhatsApp</legend>
        <label className="block text-sm font-medium text-slate-700">
          Número (com DDD)
          <input
            type="tel"
            value={form.whatsapp}
            onChange={alterar("whatsapp")}
            placeholder="(32) 99185-2108"
            className={campo}
            required
          />
        </label>
        <p className="mt-2 text-xs text-slate-500">
          Usado no botão verde flutuante, na página de Avaliação, no Contato e no rodapé.
          {numeroValido && (
            <>
              {" "}
              <a
                href={linkWhatsApp(numeroValido, form.mensagemPt)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-cyan-600 hover:text-cyan-700"
              >
                Testar este número →
              </a>
            </>
          )}
        </p>

        <p className="mt-6 text-sm font-medium text-slate-700">Mensagem pronta que o cliente vê ao abrir a conversa</p>
        {[
          ["mensagemPt", "Português"],
          ["mensagemEn", "Inglês (site em /en)"],
          ["mensagemEs", "Espanhol (site em /es)"],
        ].map(([nome, rotulo]) => (
          <label key={nome} className="mt-3 block text-xs font-medium text-slate-500">
            {rotulo}
            <textarea value={form[nome]} onChange={alterar(nome)} rows={2} maxLength={400} className={campo} />
          </label>
        ))}
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <legend className="px-2 font-semibold text-slate-900">Outros contatos</legend>
        <label className="block text-sm font-medium text-slate-700">
          Telefone exibido na página de Contato <span className="font-normal text-slate-400">(opcional — deixe vazio para ocultar)</span>
          <input type="text" value={form.telefone} onChange={alterar("telefone")} maxLength={30} className={campo} />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          E-mail de contato
          <input type="email" value={form.email} onChange={alterar("email")} maxLength={150} className={campo} required />
        </label>
        <p className="mt-2 text-xs text-slate-500">
          O e-mail dos Termos de Uso e da Política de Privacidade não muda por aqui — é texto jurídico e fica fixo.
        </p>
      </fieldset>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={salvando}
          className="rounded-full bg-cyan-600 px-8 py-3 font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
        >
          {salvando ? "Salvando…" : "Salvar alterações"}
        </button>
        {atualizado && (
          <p className="text-xs text-slate-400">
            Última alteração: {atualizado.em.toLocaleString("pt-BR")} por {atualizado.por}
          </p>
        )}
      </div>
      {aviso}
    </form>
  );
}
