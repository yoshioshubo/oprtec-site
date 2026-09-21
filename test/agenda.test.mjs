import { test } from "node:test";
import assert from "node:assert/strict";
import {
  eventosParaOcupados,
  horariosCandidatos,
  horariosLivres,
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
