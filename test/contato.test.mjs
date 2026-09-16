import test from "node:test";
import assert from "node:assert/strict";
import {
  formatarWhatsApp,
  linkWhatsApp,
  normalizarWhatsApp,
} from "../src/lib/contato.js";

test("normalizarWhatsApp aceita os formatos que o admin digita", () => {
  assert.equal(normalizarWhatsApp("(32) 99185-2108"), "5532991852108");
  assert.equal(normalizarWhatsApp("32991852108"), "5532991852108");
  assert.equal(normalizarWhatsApp("5532991852108"), "5532991852108");
  assert.equal(normalizarWhatsApp("+55 32 99185-2108"), "5532991852108");
  assert.equal(normalizarWhatsApp("3232152108"), "553232152108", "fixo com 8 digitos");
});

test("normalizarWhatsApp recusa o que nao e numero brasileiro", () => {
  assert.equal(normalizarWhatsApp(""), null);
  assert.equal(normalizarWhatsApp(null), null);
  assert.equal(normalizarWhatsApp("991852108"), null, "sem DDD");
  assert.equal(normalizarWhatsApp("123456789012345"), null, "digitos demais");
  assert.equal(normalizarWhatsApp("112233445566"), null, "12 digitos sem o 55 na frente");
});

test("formatarWhatsApp devolve o numero legivel", () => {
  assert.equal(formatarWhatsApp("5532991852108"), "(32) 99185-2108");
  assert.equal(formatarWhatsApp("553232152108"), "(32) 3215-2108");
  assert.equal(formatarWhatsApp("123"), "123", "sem formato conhecido, devolve igual");
});

test("normalizar e formatar sao inversos", () => {
  const original = "(32) 99185-2108";
  assert.equal(formatarWhatsApp(normalizarWhatsApp(original)), original);
});

test("linkWhatsApp escapa a mensagem", () => {
  assert.equal(linkWhatsApp("5532991852108"), "https://wa.me/5532991852108");
  assert.equal(
    linkWhatsApp("5532991852108", "Ola! Vim pelo site & quero saber mais"),
    "https://wa.me/5532991852108?text=Ola!%20Vim%20pelo%20site%20%26%20quero%20saber%20mais"
  );
});
