import test from "node:test";
import assert from "node:assert/strict";
import { obterIpCliente, verificarLimite } from "../src/lib/rateLimit.js";

// Cada teste usa uma chave diferente porque o contador vive em memoria no modulo.
const chave = (nome) => `${nome}-${Math.random().toString(36).slice(2)}`;

function requisicao(headers) {
  return { headers: { get: (nome) => headers[nome] ?? null } };
}

test("libera ate o limite e bloqueia a partir dai", () => {
  const ip = chave("ip");
  for (let i = 1; i <= 5; i += 1) {
    assert.equal(verificarLimite(ip).permitido, true, `tentativa ${i} deveria passar`);
  }
  assert.equal(verificarLimite(ip).permitido, false, "a 6a tentativa e bloqueada");
});

test("o restante diminui a cada tentativa", () => {
  const ip = chave("ip");
  assert.deepEqual(verificarLimite(ip), { permitido: true, restante: 4 });
  assert.deepEqual(verificarLimite(ip), { permitido: true, restante: 3 });
});

test("limite proprio por rota nao mistura contadores", () => {
  const ip = chave("ip");
  assert.equal(verificarLimite(`lead:${ip}`, { limite: 3 }).permitido, true);
  assert.equal(verificarLimite(`lead:${ip}`, { limite: 3 }).permitido, true);
  assert.equal(verificarLimite(`lead:${ip}`, { limite: 3 }).permitido, true);
  assert.equal(verificarLimite(`lead:${ip}`, { limite: 3 }).permitido, false);
  assert.equal(verificarLimite(ip).permitido, true, "a outra rota comeca do zero");
});

test("a janela zera o contador quando expira", () => {
  const ip = chave("ip");
  assert.equal(verificarLimite(ip, { limite: 1, janelaMs: 1 }).permitido, true);
  assert.equal(verificarLimite(ip, { limite: 1, janelaMs: 1 }).permitido, false);
  const fim = Date.now() + 5;
  while (Date.now() < fim) { /* espera a janela de 1ms passar */ }
  assert.equal(verificarLimite(ip, { limite: 1, janelaMs: 1 }).permitido, true);
});

test("obterIpCliente pega o primeiro IP do x-forwarded-for", () => {
  assert.equal(
    obterIpCliente(requisicao({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" })),
    "203.0.113.5"
  );
  assert.equal(obterIpCliente(requisicao({ "x-real-ip": "203.0.113.9" })), "203.0.113.9");
  assert.equal(obterIpCliente(requisicao({})), "desconhecido");
});
