import { test } from "node:test";
import assert from "node:assert/strict";
import { gradeDoMes, mesesDaJanela } from "../src/lib/calendarioMes.js";

test("meses cobertos pela janela, em ordem", () => {
  assert.deepEqual(mesesDaJanela(["2026-09-29", "2026-09-30", "2026-10-01"]), ["2026-09", "2026-10"]);
  assert.deepEqual(mesesDaJanela([]), []);
});

test("grade começa no domingo e completa as semanas", () => {
  const setembro = gradeDoMes("2026-09"); // 01/09/2026 é terça
  assert.deepEqual(setembro[0], [null, null, "2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05"]);
  assert.ok(setembro.every((semana) => semana.length === 7));
  assert.equal(setembro.flat().filter(Boolean).length, 30);
  assert.equal(gradeDoMes("2026-02").flat().filter(Boolean).length, 28);
  assert.equal(gradeDoMes("2026-11")[0][0], "2026-11-01"); // domingo
});
