import { test } from "node:test";
import assert from "node:assert/strict";
import { whatsappParaEnvio } from "../src/lib/contato.js";

test("número para o bot enviar: Brasil normalizado ou internacional com +", () => {
  assert.equal(whatsappParaEnvio("(32) 99999-0000"), "5532999990000");
  assert.equal(whatsappParaEnvio("+55 32 99999-0000"), "5532999990000");
  assert.equal(whatsappParaEnvio("+595 983 225035"), "595983225035");
  assert.equal(whatsappParaEnvio("+1 (415) 555-0100"), "14155550100");
  assert.equal(whatsappParaEnvio("99999"), null);
  assert.equal(whatsappParaEnvio("+12345"), null);
  assert.equal(whatsappParaEnvio(""), null);
});
