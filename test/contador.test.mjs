import test from "node:test";
import assert from "node:assert/strict";
import { formatarNumero, separarNumero } from "../src/lib/contador.js";

// Formata o número final do jeito que o contador exibe, para comparar com o texto original.
const remontar = (texto) => {
  const p = separarNumero(texto);
  return p.prefixo + formatarNumero(p.alvo, p) + p.sufixo;
};

test("separarNumero mantém prefixo e sufixo dos resultados da Home", () => {
  assert.deepEqual(separarNumero("+R$ 192 MM"), {
    prefixo: "+R$ ", sufixo: " MM", alvo: 192, casas: 0, sep: null, milhar: null,
  });
  const desperdicio = separarNumero("−327 toneladas");
  assert.equal(desperdicio.prefixo, "−");
  assert.equal(desperdicio.alvo, 327);
});

test("separarNumero entende decimal com vírgula e com ponto", () => {
  assert.equal(separarNumero("R$ 9,8 MM").alvo, 9.8);
  assert.equal(separarNumero("R$ 9,8 MM").sep, ",");
  assert.equal(separarNumero("R$ 9.8M").alvo, 9.8);
  assert.equal(separarNumero("R$ 9.8M").sep, ".");
});

test("separador com 3 dígitos é milhar, não decimal", () => {
  const p = separarNumero("mais de 1.000 clientes");
  assert.equal(p.alvo, 1000);
  assert.equal(p.casas, 0);
  assert.equal(formatarNumero(537, p), "537");
  assert.equal(formatarNumero(1000, p), "1.000");
});

test("o valor final remontado é idêntico ao texto original (pt, en, es)", () => {
  for (const texto of ["+R$ 192 MM", "−327 toneladas", "R$ 9,8 MM", "+19 mil horas",
    "+R$ 192M", "−327 tons", "R$ 9.8M", "+19k hours", "mais de 1.000 clientes"]) {
    assert.equal(remontar(texto), texto);
  }
});

test("valores intermediários respeitam as casas decimais", () => {
  const p = separarNumero("R$ 9,8 MM");
  assert.equal(formatarNumero(0, p), "0,0");
  assert.equal(formatarNumero(4.26, p), "4,3");
});

test("texto sem número não é animado", () => {
  assert.equal(separarNumero("sem número"), null);
});
