import test from "node:test";
import assert from "node:assert/strict";
import {
  ANNUAL_DISCOUNT_PCT,
  economiaAnual,
  planoTemFuncao,
  planos,
  precoMensalNoAnual,
  precoTotalAnual,
} from "../src/data/planos.js";

test("preco anual aplica o desconto anunciado", () => {
  assert.equal(ANNUAL_DISCOUNT_PCT, 28);
  assert.equal(precoMensalNoAnual(188), 135);
  assert.equal(precoTotalAnual(188), 1620);
  assert.equal(economiaAnual(188), 636);
});

test("o valor cobrado de uma vez bate com 12 mensalidades com desconto", () => {
  for (const plano of planos) {
    assert.equal(precoTotalAnual(plano.preco), precoMensalNoAnual(plano.preco) * 12);
    assert.equal(
      economiaAnual(plano.preco),
      plano.preco * 12 - precoTotalAnual(plano.preco)
    );
    assert.ok(economiaAnual(plano.preco) > 0, "o plano anual precisa ser mais barato");
  }
});

test("os tres planos existem com preco inteiro e um destaque so", () => {
  assert.deepEqual(planos.map((p) => p.slug), ["junior", "pleno", "senior"]);
  for (const plano of planos) {
    assert.ok(Number.isInteger(plano.preco) && plano.preco > 0);
  }
  assert.equal(planos.filter((p) => p.destaque).length, 1);
});

test("cada plano herda as funcoes dos niveis anteriores", () => {
  assert.ok(planoTemFuncao("senior", "junior"));
  assert.ok(planoTemFuncao("pleno", "pleno"));
  assert.ok(!planoTemFuncao("junior", "pleno"));
  assert.ok(!planoTemFuncao("pleno", "senior"));
});
