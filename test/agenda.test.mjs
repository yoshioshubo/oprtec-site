import { test } from "node:test";
import assert from "node:assert/strict";
import {
  dataBrasilia,
  diasDaAgenda,
  eventosParaOcupados,
  horariosCandidatos,
  horariosLivres,
  inicioDoDia,
  montarAgendaAdmin,
  normalizarEvento,
  validarHorario,
} from "../src/lib/agenda.js";

// Segunda-feira, 21/09/2026, 10h em Brasília.
const AGORA = Date.parse("2026-09-21T10:00:00-03:00");
const lista = () => horariosCandidatos(AGORA).map((h) => h.iso);

test("respeita 24h de antecedência", () => {
  assert.equal(lista()[0], "2026-09-22T10:00:00-03:00");
  assert.ok(!lista().includes("2026-09-22T09:30:00-03:00"));
});

test("janelas 9h-12h e 14h-18h, de 30 em 30 minutos", () => {
  const dia = lista().filter((i) => i.startsWith("2026-09-23"));
  assert.equal(dia.length, 14);
  assert.equal(dia[0], "2026-09-23T09:00:00-03:00");
  assert.ok(dia.includes("2026-09-23T11:30:00-03:00"));
  assert.ok(!dia.includes("2026-09-23T12:00:00-03:00"));
  assert.ok(!dia.includes("2026-09-23T13:30:00-03:00"));
  assert.ok(dia.includes("2026-09-23T14:00:00-03:00"));
  assert.equal(dia.at(-1), "2026-09-23T17:30:00-03:00");
});

test("só dias úteis e até 14 dias à frente", () => {
  const todos = lista();
  assert.ok(!todos.some((i) => i.startsWith("2026-09-26") || i.startsWith("2026-09-27")));
  assert.ok(todos.some((i) => i.startsWith("2026-10-05")));
  assert.ok(!todos.some((i) => i.startsWith("2026-10-06")));
});

test("evento ocupado bloqueia os horários que ele cobre", () => {
  const ocupados = [
    {
      inicio: Date.parse("2026-09-23T14:15:00-03:00"),
      fim: Date.parse("2026-09-23T14:45:00-03:00"),
    },
  ];
  const livres = horariosLivres({ agora: AGORA, ocupados });
  assert.ok(!livres.includes("2026-09-23T14:00:00-03:00"));
  assert.ok(!livres.includes("2026-09-23T14:30:00-03:00"));
  assert.ok(livres.includes("2026-09-23T15:00:00-03:00"));
  assert.ok(livres.includes("2026-09-23T11:30:00-03:00"));
});

test("converte eventos do Google Agenda em intervalos ocupados", () => {
  const ocupados = eventosParaOcupados([
    { status: "cancelled", start: { dateTime: "2026-09-23T09:00:00-03:00" }, end: { dateTime: "2026-09-23T10:00:00-03:00" } },
    { transparency: "transparent", start: { dateTime: "2026-09-23T10:00:00-03:00" }, end: { dateTime: "2026-09-23T11:00:00-03:00" } },
    {
      attendees: [{ self: true, responseStatus: "declined" }],
      start: { dateTime: "2026-09-23T11:00:00-03:00" },
      end: { dateTime: "2026-09-23T12:00:00-03:00" },
    },
    { start: { dateTime: "2026-09-23T15:00:00-03:00" }, end: { dateTime: "2026-09-23T16:00:00-03:00" } },
    { transparency: "transparent", start: { date: "2026-09-24" }, end: { date: "2026-09-25" } },
  ]);
  const livres = horariosLivres({ agora: AGORA, ocupados });

  assert.equal(ocupados.length, 2);
  assert.ok(livres.includes("2026-09-23T09:00:00-03:00"));
  assert.ok(livres.includes("2026-09-23T10:00:00-03:00"));
  assert.ok(livres.includes("2026-09-23T11:00:00-03:00"));
  assert.ok(!livres.includes("2026-09-23T15:00:00-03:00"));
  assert.ok(!livres.includes("2026-09-23T15:30:00-03:00"));
  assert.ok(!livres.some((i) => i.startsWith("2026-09-24")));
  assert.ok(livres.some((i) => i.startsWith("2026-09-25")));
});

test("valida só horários que a agenda ofereceria", () => {
  assert.equal(validarHorario("2026-09-23T14:00:00-03:00", AGORA)?.iso, "2026-09-23T14:00:00-03:00");
  assert.equal(validarHorario("2026-09-23T17:00:00Z", AGORA)?.iso, "2026-09-23T14:00:00-03:00");
  assert.equal(validarHorario("2026-09-23T14:15:00-03:00", AGORA), null);
  assert.equal(validarHorario("2026-09-26T10:00:00-03:00", AGORA), null);
  assert.equal(validarHorario("2026-09-22T09:30:00-03:00", AGORA), null);
  assert.equal(validarHorario("amanhã cedo", AGORA), null);
  assert.equal(validarHorario(undefined, AGORA), null);
});

test("validarHorario no modo admin aceita sem antecedência e até 90 dias", () => {
  const admin = { dias: 90, antecedenciaMs: 0 };
  assert.equal(validarHorario("2026-09-21T10:30:00-03:00", AGORA), null);
  assert.ok(validarHorario("2026-09-21T10:30:00-03:00", AGORA, admin));
  assert.ok(validarHorario("2026-12-18T09:00:00-03:00", AGORA, admin));
  assert.equal(validarHorario("2026-12-21T09:00:00-03:00", AGORA, admin), null);
});

test("diasDaAgenda cobre hoje + 14 dias, com fim de semana vazio", () => {
  const dias = diasDaAgenda({ agora: AGORA });
  assert.equal(dias.length, 15);
  assert.equal(dias[0].data, "2026-09-21");
  assert.deepEqual(dias[0].horarios, []); // hoje: antecedência de 24h
  assert.equal(dias[1].horarios[0], "2026-09-22T10:00:00-03:00");
  assert.deepEqual(dias.find((d) => d.data === "2026-09-26").horarios, []);
  assert.equal(dias.find((d) => d.data === "2026-09-23").horarios.length, 14);
  assert.equal(dias.at(-1).data, "2026-10-05");
});

test("datas de Brasília e meia-noite", () => {
  assert.equal(dataBrasilia(Date.parse("2026-09-22T02:00:00Z")), "2026-09-21");
  assert.equal(inicioDoDia("2026-09-23"), Date.parse("2026-09-23T03:00:00Z"));
  assert.ok(Number.isNaN(inicioDoDia("2026-02-31")));
  assert.ok(Number.isNaN(inicioDoDia("23/09/2026")));
});

test("normalizarEvento reconhece agendamento, bloqueio e outros", () => {
  const ag = normalizarEvento({
    id: "a1",
    summary: "Avaliação",
    start: { dateTime: "2026-09-23T14:00:00-03:00" },
    end: { dateTime: "2026-09-23T14:30:00-03:00" },
    extendedProperties: { private: { oprtec: "agendamento", empresa: "Bar X" } },
    hangoutLink: "https://meet.google.com/abc",
  });
  assert.equal(ag.tipo, "agendamento");
  assert.equal(ag.meet, "https://meet.google.com/abc");
  const estranho = normalizarEvento({ extendedProperties: { private: { oprtec: "hack" } }, start: { date: "2026-09-24" } });
  assert.equal(estranho.tipo, "outro");
  const invertido = normalizarEvento({
    start: { dateTime: "2026-09-23T15:00:00-03:00" },
    end: { dateTime: "2026-09-23T14:00:00-03:00" },
  });
  assert.equal(invertido, null);
});

test("montarAgendaAdmin classifica cada horário", () => {
  const eventos = [
    {
      id: "ag1",
      start: { dateTime: "2026-09-23T14:00:00-03:00" },
      end: { dateTime: "2026-09-23T14:30:00-03:00" },
      extendedProperties: {
        private: { oprtec: "agendamento", empresa: "Bar X", nome: "Ana", whatsapp: "5532999990000", email: "a@x.com", idioma: "pt" },
      },
    },
    {
      id: "bl1",
      start: { dateTime: "2026-09-23T15:00:00-03:00" },
      end: { dateTime: "2026-09-23T15:30:00-03:00" },
      extendedProperties: { private: { oprtec: "bloqueio" } },
    },
    { id: "bl2", start: { date: "2026-09-24" }, end: { date: "2026-09-25" }, extendedProperties: { private: { oprtec: "bloqueio" } } },
    {
      id: "ou1",
      summary: "Reunião banco",
      start: { dateTime: "2026-09-23T16:00:00-03:00" },
      end: { dateTime: "2026-09-23T17:00:00-03:00" },
    },
  ];
  const { dias, agendamentos } = montarAgendaAdmin({ agora: AGORA, eventos });
  assert.equal(dias.length, 91);

  const hoje = dias[0];
  assert.equal(hoje.horarios.find((h) => h.iso === "2026-09-21T09:30:00-03:00").status, "passado");
  assert.equal(hoje.horarios.find((h) => h.iso === "2026-09-21T10:00:00-03:00").status, "livre");

  const d23 = dias.find((d) => d.data === "2026-09-23");
  const slot = (hora) => d23.horarios.find((h) => h.iso === `2026-09-23T${hora}:00-03:00`);
  assert.equal(slot("14:00").status, "agendado");
  assert.equal(slot("14:00").rotulo, "Bar X");
  assert.equal(slot("15:00").status, "bloqueado");
  assert.equal(slot("15:00").removivel, true);
  assert.equal(slot("15:00").eventoId, "bl1");
  assert.equal(slot("16:00").status, "ocupado");
  assert.equal(slot("16:30").rotulo, "Reunião banco");
  assert.equal(slot("17:00").status, "livre");

  const d24 = dias.find((d) => d.data === "2026-09-24");
  assert.equal(d24.bloqueioDiaId, "bl2");
  assert.ok(d24.horarios.every((h) => h.status === "bloqueado" && !h.removivel));

  const sabado = dias.find((d) => d.data === "2026-09-26");
  assert.equal(sabado.util, false);
  assert.deepEqual(sabado.horarios, []);

  assert.equal(agendamentos.length, 1);
  assert.equal(agendamentos[0].empresa, "Bar X");
  assert.equal(agendamentos[0].whatsapp, "5532999990000");
});
