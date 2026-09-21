import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emailCancelamento,
  emailConfirmacao,
  formatarDataHora,
  whatsappAvisoOprtec,
  whatsappCancelamento,
  whatsappConfirmacao,
} from "../src/lib/mensagensAgenda.js";

const INICIO = "2026-09-23T15:30:00-03:00";

test("data e hora em Brasília, no idioma do visitante", () => {
  assert.match(formatarDataHora(INICIO, "pt"), /^Quarta-feira, 23 de setembro.*15:30/);
  assert.match(formatarDataHora(INICIO, "en"), /Wednesday, September 23.*03:30/);
  assert.match(formatarDataHora(INICIO, "es"), /^Miércoles, 23 de septiembre.*15:30/);
  assert.match(formatarDataHora(INICIO, "xx"), /^Quarta-feira/);
});

test("WhatsApp de confirmação traz data, Meet e tira marcação do nome", () => {
  const texto = whatsappConfirmacao({ nome: "*Ana*", inicio: INICIO, meet: "https://meet.google.com/abc", idioma: "pt" });
  assert.match(texto, /Olá, Ana!/);
  assert.match(texto, /15:30/);
  assert.match(texto, /https:\/\/meet\.google\.com\/abc/);
  assert.doesNotMatch(whatsappConfirmacao({ nome: "Ana", inicio: INICIO, meet: null, idioma: "en" }), /Google Meet\)/);
});

test("WhatsApp nunca pede para responder ao bot e aponta o atendimento humano", () => {
  for (const idioma of ["pt", "en", "es"]) {
    const confirmacao = whatsappConfirmacao({ nome: "Ana", inicio: INICIO, meet: null, idioma, whatsappOprtec: "5532991730821" });
    const cancelamento = whatsappCancelamento({ nome: "Ana", inicio: INICIO, idioma, whatsappOprtec: "5532991730821" });
    for (const texto of [confirmacao, cancelamento]) {
      assert.doesNotMatch(texto, /responda|reply|responde/i);
      assert.match(texto, /https:\/\/wa\.me\/5532991730821/);
    }
  }
  // Sem número de atendimento a mensagem continua válida, só sem o link.
  assert.doesNotMatch(whatsappConfirmacao({ nome: "Ana", inicio: INICIO, meet: null, idioma: "pt" }), /wa\.me/);
});

test("aviso interno e cancelamento", () => {
  const aviso = whatsappAvisoOprtec({
    empresa: "Bar X",
    nome: "Ana",
    whatsapp: "5532999990000",
    email: "a@x.com",
    inicio: INICIO,
    meet: null,
  });
  assert.match(aviso, /Bar X/);
  assert.match(aviso, /5532999990000/);
  assert.match(whatsappCancelamento({ nome: "Ana", inicio: INICIO, idioma: "es" }), /cancelada/);
});

test("e-mail escapa o que o visitante digitou", () => {
  const { assunto, html } = emailConfirmacao({
    nome: '<a href="x">Ana</a>',
    inicio: INICIO,
    meet: "https://meet.google.com/abc",
    idioma: "pt",
  });
  assert.match(assunto, /confirmada/);
  assert.ok(!html.includes('<a href="x">'));
  assert.ok(html.includes("&lt;a href=&quot;x&quot;&gt;Ana"));
  assert.ok(html.includes("https://meet.google.com/abc"));
  const cancelamento = emailCancelamento({ nome: "Ana", inicio: INICIO, idioma: "en" });
  assert.ok(cancelamento.html.includes("https://www.oprtec.com.br/en/avaliacao"));
});
