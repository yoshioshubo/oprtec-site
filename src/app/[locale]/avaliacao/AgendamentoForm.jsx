"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Limites um pouco abaixo dos das regras do Firestore (200/200/30/150).
const LIMITES = { empresa: 190, nome: 190, whatsapp: 25, email: 150 };
const FUSO = "America/Sao_Paulo";
const IDIOMAS = { pt: "pt-BR", en: "en-US", es: "es" };

const entrada =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:bg-slate-50 disabled:text-slate-400";

async function buscarHorarios() {
  const resposta = await fetch("/api/agenda/horarios", { cache: "no-store" });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  const dados = await resposta.json();
  return Array.isArray(dados.horarios) ? dados.horarios : [];
}

const maiuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

export default function AgendamentoForm() {
  const t = useTranslations("agendamento");
  const locale = useLocale();
  const idioma = IDIOMAS[locale] || "pt-BR";

  const [horarios, setHorarios] = useState(null); // null = carregando
  const [erroAgenda, setErroAgenda] = useState(false);
  const [horario, setHorario] = useState("");
  const [aceitou, setAceitou] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState({ tipo: "", texto: "" });
  const [confirmado, setConfirmado] = useState(null);

  useEffect(() => {
    let ativo = true;
    buscarHorarios()
      .then((lista) => ativo && setHorarios(lista))
      .catch((erro) => {
        console.error("Erro ao carregar horários:", erro);
        if (!ativo) return;
        setErroAgenda(true);
        setHorarios([]);
      });
    return () => {
      ativo = false;
    };
  }, []);

  // Um único campo de data e hora: um <select> agrupado por dia. Cada opção leva o dia
  // abreviado, para o campo fechado continuar dizendo qual dia foi escolhido.
  const grupos = useMemo(() => {
    const dia = new Intl.DateTimeFormat(idioma, {
      timeZone: FUSO,
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const curto = new Intl.DateTimeFormat(idioma, {
      timeZone: FUSO,
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
    const hora = new Intl.DateTimeFormat(idioma, {
      timeZone: FUSO,
      hour: "2-digit",
      minute: "2-digit",
    });

    const mapa = new Map();
    for (const iso of horarios || []) {
      const data = new Date(iso);
      const chave = iso.slice(0, 10);
      if (!mapa.has(chave)) {
        mapa.set(chave, { chave, rotulo: maiuscula(dia.format(data)), opcoes: [] });
      }
      mapa.get(chave).opcoes.push({
        iso,
        texto: `${maiuscula(curto.format(data))} · ${hora.format(data)}`,
      });
    }
    return [...mapa.values()];
  }, [horarios, idioma]);

  const formatarCompleto = (iso) =>
    new Intl.DateTimeFormat(idioma, {
      timeZone: FUSO,
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aceitou) {
      setStatus({ tipo: "erro", texto: t("alertaAceite") });
      return;
    }

    const dados = new FormData(e.currentTarget);
    const texto = (campo) => String(dados.get(campo) || "").trim();

    setEnviando(true);
    setStatus({ tipo: "", texto: "" });

    try {
      const resposta = await fetch("/api/agenda/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa: texto("empresa"),
          nome: texto("nome"),
          whatsapp: texto("whatsapp"),
          email: texto("email"),
          inicio: horario,
          idioma: locale,
          site: texto("site"),
          aceitouPrivacidade: true,
        }),
      });
      const retorno = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        const mensagens = {
          "horario-indisponivel": t("indisponivel"),
          "email-invalido": t("emailInvalido"),
          "whatsapp-invalido": t("whatsappInvalido"),
        };
        setStatus({
          tipo: "erro",
          texto: resposta.status === 429 ? t("muitasTentativas") : mensagens[retorno.error] || t("erro"),
        });
        if (retorno.error === "horario-indisponivel") {
          setHorario("");
          buscarHorarios().then(setHorarios).catch(() => {});
        }
        return;
      }

      setConfirmado({
        inicio: retorno.inicio || horario,
        email: texto("email"),
        meet: retorno.meet || null,
      });
    } catch (erro) {
      console.error("Erro ao agendar:", erro);
      setStatus({ tipo: "erro", texto: t("erro") });
    } finally {
      setEnviando(false);
    }
  };

  if (confirmado) {
    return (
      <div role="status" className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900">{t("sucessoTitulo")}</h2>
        <p className="text-slate-700">
          {t("sucessoTexto", {
            data: formatarCompleto(confirmado.inicio),
            email: confirmado.email,
          })}
        </p>
        {confirmado.meet && (
          <a
            href={confirmado.meet}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            {t("sucessoMeet")}
          </a>
        )}
        <p className="text-sm text-slate-500">{t("sucessoSpam")}</p>
      </div>
    );
  }

  const semHorarios = horarios !== null && grupos.length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="empresa">
          {t("empresa")}
        </label>
        <input id="empresa" name="empresa" type="text" required maxLength={LIMITES.empresa} autoComplete="organization" className={entrada} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="nome">
          {t("nome")}
        </label>
        <input id="nome" name="nome" type="text" required maxLength={LIMITES.nome} autoComplete="name" className={entrada} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="whatsapp">
            {t("whatsapp")}
          </label>
          <input id="whatsapp" name="whatsapp" type="tel" required maxLength={LIMITES.whatsapp} autoComplete="tel" placeholder="(32) 99999-9999" className={entrada} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            {t("email")}
          </label>
          <input id="email" name="email" type="email" required maxLength={LIMITES.email} autoComplete="email" className={entrada} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="horario">
          {t("horario")}
        </label>
        <select
          id="horario"
          name="horario"
          required
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          disabled={!grupos.length}
          className={entrada}
        >
          <option value="" disabled>
            {horarios === null ? t("carregando") : t("horarioPlaceholder")}
          </option>
          {grupos.map((g) => (
            <optgroup key={g.chave} label={g.rotulo}>
              {g.opcoes.map((o) => (
                <option key={o.iso} value={o.iso}>
                  {o.texto}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate-500">
          {semHorarios ? (erroAgenda ? t("erroHorarios") : t("semHorarios")) : t("fusoNota")}
        </p>
      </div>

      {/* honeypot: invisivel para gente, irresistivel para bot que preenche tudo */}
      <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={aceitou}
          onChange={(e) => setAceitou(e.target.checked)}
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
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200"
        >
          {status.texto}
        </p>
      )}

      <button
        type="submit"
        disabled={!aceitou || !horario || enviando}
        className="w-full rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {enviando ? t("enviando") : t("enviar")}
      </button>
    </form>
  );
}
