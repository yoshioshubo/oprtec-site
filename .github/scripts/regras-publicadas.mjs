// Baixa as regras do Firestore que estão valendo em produção e grava num arquivo, para o
// workflow comparar com firestore.rules antes e depois de publicar.
// Uso: node regras-publicadas.mjs <projeto> <arquivo-de-saida>
// Credencial: GOOGLE_APPLICATION_CREDENTIALS. Dependência: google-auth-library instalada
// na pasta FERRAMENTAS (fora do projeto). Nunca imprime token nem cabeçalhos.
import { createRequire } from "node:module";
import { join } from "node:path";
import { writeFileSync } from "node:fs";

const require = createRequire(join(process.env.FERRAMENTAS, "package.json"));
const { GoogleAuth } = require("google-auth-library");

const [projeto, saida] = process.argv.slice(2);
const API = "https://firebaserules.googleapis.com/v1";
const cliente = await new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
}).getClient();

async function obter(url) {
  try {
    return (await cliente.request({ url })).data;
  } catch (erro) {
    // Só o status: o objeto de erro do gaxios carrega o cabeçalho Authorization.
    const status = erro?.response?.status;
    const e = new Error(`HTTP ${status ?? "?"} em ${url}`);
    e.status = status;
    throw e;
  }
}

let release;
try {
  release = await obter(`${API}/projects/${projeto}/releases/cloud.firestore`);
} catch (erro) {
  if (erro.status !== 404) {
    console.error(erro.message);
    process.exit(1);
  }
  console.log("Nenhuma regra publicada ainda neste projeto.");
  writeFileSync(saida, "");
  process.exit(0);
}

const ruleset = await obter(`${API}/${release.rulesetName}`);
writeFileSync(saida, ruleset.source.files.map((f) => f.content).join("\n"));
console.log(`Publicado hoje: ${release.rulesetName} (desde ${release.updateTime})`);
