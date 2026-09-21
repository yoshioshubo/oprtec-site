"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gradeDoMes, mesesDaJanela } from "@/lib/calendarioMes";

// Limites um pouco abaixo dos das regras do Firestore (200/200/30/150).
const LIMITES = { empresa: 190, nome: 190, whatsapp: 25, email: 150 };
const FUSO = "America/Sao_Paulo";
const IDIOMAS = { pt: "pt-BR", en: "en-US", es: "es" };

const entrada =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500";

async function buscarDias() {
  const resposta = await fetch("/api/agenda/horarios", { cache: "no-store" });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  const dados = await resposta.json();
  return Array.isArray(dados.dias) ? dados.dias : [];
}

const maiuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);
// Meio-dia UTC de uma data "YYYY-MM-DD": formatar em Brasília nunca muda o dia.
const meioDia = (data) => new Date(`${data}T12:00:00Z`);

export default function AgendamentoForm() {
  const t = useTranslations("agendamento");
  const locale = useLocale();
  const idioma = IDIOMAS[locale] || "pt-BR";

  const [dias, setDias] = useState(null); // null = carregando
  const [erroAgenda, setErroAgenda] = useState(false);
  const [mesIndice, setMesIndice] = useState(0);
  const [diaEscolhido, setDiaEscolhido] = useState("");
  const [horario, setHorario] = useState("");
  const [aceitou, setAceitou] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState({ tipo: "", texto: "" });
  const [confirmado, setConfirmado] = useState(null);

  useEffect(() => {
    let ativo = true;
    buscarDias()
      .then((lista) => ativo && setDias(lista))
      .catch((erro) => {
        console.error("Erro ao carregar a agenda:", erro);
        if (!ativo) return;
        setErroAgenda(true);
        setDias([]);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const formatos = useMemo(
    () => ({
      mes: new Intl.DateTimeFormat(idioma, { timeZone: "UTC", month: "long", year: "numeric" }),
      semana: new Intl.DateTimeFormat(idioma, { timeZone: "UTC", weekday: "short" }),
      diaLongo: new Intl.DateTimeFormat(idioma, { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }),
      hora: new Intl.DateTimeFormat(idioma, { timeZone: FUSO, hour: "2-digit", minute: "2-digit" }),
      completo: new Intl.DateTimeFormat(idioma, {
        timeZone: FUSO,
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }),
    [idioma]
  );

  const porData = useMemo(() => new Map((dias || []).map((d) => [d.data, d.horarios])), [dias]);
  const meses = useMemo(() => mesesDaJanela((dias || []).map((d) => d.data)), [dias]);
  const mesAtual = meses[Math.min(mesIndice, Math.max(meses.length - 1, 0))];
  // Cabeçalho dom..sáb: 04/01/2026 foi um domingo.
  const nomesSemana = useMemo(
    () => Array.from({ length: 7 }, (_, i) => formatos.semana.format(new Date(Date.UTC(2026, 0, 4 + i, 12))).replace(".", "")),
    [formatos]
  );

  const horariosDoDia = diaEscolhido ? porData.get(diaEscolhido) || [] : [];
  const temAlgumHorario = (dias || []).some((d) => d.horarios.length > 0);

  const escolherDia = (data) => {
    setDiaEscolhido(data);
    setHorario("");
    setStatus({ tipo: "", texto: "" });
  };

  const recarregar = () => {
    buscarDias()
      .then((lista) => {
        setDias(lista);
        setErroAgenda(false);
      })
      .catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!horario) {
      setStatus({ tipo: "erro", texto: t("escolhaHorario") });
      return;
    }
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
          recarregar();
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
            data: maiuscula(formatos.completo.format(new Date(confirmado.inicio))),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Calendário */}
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900">{t("passoData")}</legend>

        {dias === null ? (
          <div className="mt-3 h-72 animate-pulse rounded-xl bg-slate-100" aria-label={t("carregando")} />
        ) : !temAlgumHorario ? (
          <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
            {erroAgenda ? t("erroHorarios") : t("semHorarios")}
          </p>
        ) : (
          <div className="mt-3 rounded-xl border border-slate-200 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMesIndice((i) => Math.max(i - 1, 0))}
                disabled={mesIndice === 0}
                aria-label={t("mesAnterior")}
                className="rounded-full px-3 py-1 text-lg text-slate-600 hover:bg-slate-100 disabled:invisible"
              >
                ‹
              </button>
              <p className="text-sm font-semibold text-slate-900" aria-live="polite">
                {maiuscula(formatos.mes.format(meioDia(`${mesAtual}-01`)))}
              </p>
              <button
                type="button"
                onClick={() => setMesIndice((i) => Math.min(i + 1, meses.length - 1))}
                disabled={mesIndice >= meses.length - 1}
                aria-label={t("proximoMes")}
                className="rounded-full px-3 py-1 text-lg text-slate-600 hover:bg-slate-100 disabled:invisible"
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase text-slate-500">
              {nomesSemana.map((nome) => (
                <span key={nome}>{nome}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {gradeDoMes(mesAtual)
                .flat()
                .map((data, i) => {
                  if (!data) return <span key={`vazio-${i}`} />;
                  const numero = Number(data.slice(8));
                  const horarios = porData.get(data);
                  if (!horarios) {
                    // Fora da janela de agendamento (passado ou além de 14 dias).
                    return (
                      <span key={data} className="flex aspect-square items-center justify-center rounded-lg text-sm text-slate-300">
                        {numero}
                      </span>
                    );
                  }
                  const disponivel = horarios.length > 0;
                  const escolhido = data === diaEscolhido;
                  const rotulo = `${maiuscula(formatos.diaLongo.format(meioDia(data)))} — ${
                    disponivel ? t("diaDisponivel", { quantidade: horarios.length }) : t("indisponivelLegenda")
                  }`;
                  return (
                    <button
                      key={data}
                      type="button"
                      disabled={!disponivel}
                      onClick={() => escolherDia(data)}
                      aria-pressed={escolhido}
                      aria-label={rotulo}
                      title={rotulo}
                      className={`flex aspect-square items-center justify-center rounded-lg text-sm font-semibold transition ${
                        escolhido
                          ? "bg-emerald-600 text-white shadow ring-2 ring-emerald-600 ring-offset-2"
                          : disponivel
                            ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300 hover:bg-emerald-100"
                            : "cursor-not-allowed bg-red-50 text-red-400 ring-1 ring-red-200"
                      }`}
                    >
                      {numero}
                    </button>
                  );
                })}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-emerald-100 ring-1 ring-emerald-400" /> {t("disponivelLegenda")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-red-50 ring-1 ring-red-300" /> {t("indisponivelLegenda")}
              </span>
            </div>
          </div>
        )}
      </fieldset>

      {/* 2. Horário do dia escolhido */}
      {diaEscolhido && (
        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">
            {t("passoHorario", { dia: maiuscula(formatos.diaLongo.format(meioDia(diaEscolhido))) })}
          </legend>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {horariosDoDia.map((iso) => {
              const escolhido = iso === horario;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => {
                    setHorario(iso);
                    setStatus({ tipo: "", texto: "" });
                  }}
                  aria-pressed={escolhido}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold tabular-nums transition ${
                    escolhido
                      ? "bg-cyan-600 text-white shadow"
                      : "bg-white text-cyan-700 ring-1 ring-cyan-300 hover:bg-cyan-50"
                  }`}
                >
                  {formatos.hora.format(new Date(iso))}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-500">{t("fusoNota")}</p>
        </fieldset>
      )}

      {/* 3. Dados */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-slate-900">{t("passoDados")}</legend>
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
            <input id="whatsapp" name="whatsapp" type="tel" required maxLength={LIMITES.whatsapp} autoComplete="tel" placeholder={t("whatsappExemplo")} className={entrada} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              {t("email")}
            </label>
            <input id="email" name="email" type="email" required maxLength={LIMITES.email} autoComplete="email" className={entrada} />
          </div>
        </div>
      </fieldset>

      {/* honeypot: invisivel para gente, irresistivel para bot que preenche tudo */}
      <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {horario && (
        <p className="rounded-lg bg-cyan-50 px-4 py-3 text-sm text-cyan-900 ring-1 ring-cyan-200">
          {t("resumo", { data: maiuscula(formatos.completo.format(new Date(horario))) })}
        </p>
      )}

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
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
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
