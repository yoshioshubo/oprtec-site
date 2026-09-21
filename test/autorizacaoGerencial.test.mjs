import { test } from "node:test";
import assert from "node:assert/strict";
import { conferirPayload, lerPayloadJwt } from "../src/lib/autorizacaoGerencial.js";

const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const AGORA = Date.parse("2026-09-21T13:00:00Z");
const VALIDO = {
  aud: "opr-tec-gerencial",
  iss: "https://securetoken.google.com/opr-tec-gerencial",
  exp: AGORA / 1000 + 600,
  sub: "abcDEF123_-",
};

test("lê o payload de um JWT", () => {
  assert.deepEqual(lerPayloadJwt(`x.${b64({ a: 1 })}.y`), { a: 1 });
  assert.equal(lerPayloadJwt("sem-pontos"), null);
  assert.equal(lerPayloadJwt("a.@@@.b"), null);
  assert.equal(lerPayloadJwt(undefined), null);
});

test("aceita só token do projeto do gerencial, válido e com uid seguro", () => {
  assert.equal(conferirPayload(VALIDO, { agora: AGORA }), null);
  assert.equal(conferirPayload({ ...VALIDO, aud: "oprtec-agendamento" }, { agora: AGORA }), "token-de-outro-projeto");
  assert.equal(conferirPayload({ ...VALIDO, iss: "https://evil" }, { agora: AGORA }), "token-de-outro-projeto");
  assert.equal(conferirPayload({ ...VALIDO, exp: AGORA / 1000 - 1 }, { agora: AGORA }), "token-expirado");
  assert.equal(conferirPayload({ ...VALIDO, sub: "../users/x" }, { agora: AGORA }), "token-invalido");
  assert.equal(conferirPayload(null, { agora: AGORA }), "token-invalido");
});
