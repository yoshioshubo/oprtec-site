// Autorização das rotas /api/agenda/admin/*, chamadas pelo painel "Agenda de Avaliações"
// do gerencial (app.oprtec.com.br), que usa o Firebase Auth do projeto opr-tec-gerencial.
//
// Como verificamos sem instalar o Admin SDK nem guardar credencial nova:
//   1. conferimos no token o projeto (aud/iss), a validade (exp) e o uid (sub);
//   2. lemos users/{uid} no Firestore do gerencial usando o PRÓPRIO token do usuário.
//      O Firestore valida a assinatura do token — token falso ou vencido recebe 401 — e a
//      regra de lá só deixa cada um ler o próprio documento;
//   3. exigimos role == "super_admin", a mesma regra da Área de Trabalho do gerencial.
export const PROJETO_GERENCIAL = process.env.GERENCIAL_FIREBASE_PROJECT || "opr-tec-gerencial";

// Lê (sem validar assinatura) o conteúdo de um JWT. A assinatura é validada pelo Firestore.
export function lerPayloadJwt(token) {
  const partes = String(token || "").split(".");
  if (partes.length !== 3) return null;
  try {
    const json = Buffer.from(partes[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const payload = JSON.parse(json);
    return payload && typeof payload === "object" ? payload : null;
  } catch {
    return null;
  }
}

export function conferirPayload(payload, { projeto = PROJETO_GERENCIAL, agora = Date.now() } = {}) {
  if (!payload) return "token-invalido";
  if (payload.aud !== projeto || payload.iss !== `https://securetoken.google.com/${projeto}`) return "token-de-outro-projeto";
  if (!Number.isFinite(payload.exp) || payload.exp * 1000 <= agora) return "token-expirado";
  if (typeof payload.sub !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(payload.sub)) return "token-invalido";
  return null;
}

// Devolve { ok: true, uid, email } ou { ok: false, status, error }.
export async function verificarSuperAdmin(request) {
  const cabecalho = request.headers.get("authorization") || "";
  const token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7).trim() : "";
  if (!token) return { ok: false, status: 401, error: "sem-token" };

  const payload = lerPayloadJwt(token);
  const problema = conferirPayload(payload);
  if (problema) return { ok: false, status: 401, error: problema };

  const url = `https://firestore.googleapis.com/v1/projects/${PROJETO_GERENCIAL}/databases/(default)/documents/users/${payload.sub}`;
  let resposta;
  try {
    resposta = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return { ok: false, status: 502, error: "falha-ao-verificar" };
  }

  if (resposta.status === 401 || resposta.status === 403) return { ok: false, status: 401, error: "token-recusado" };
  if (resposta.status === 404) return { ok: false, status: 403, error: "sem-permissao" };
  if (!resposta.ok) return { ok: false, status: 502, error: "falha-ao-verificar" };

  const { fields = {} } = await resposta.json().catch(() => ({}));
  if (fields.role?.stringValue !== "super_admin") return { ok: false, status: 403, error: "sem-permissao" };

  return { ok: true, uid: payload.sub, email: payload.email || "" };
}

// O painel roda em outro domínio (app.oprtec.com.br e as instâncias do gerencial).
// Liberar a origem não abre nada: a autorização é o token Bearer, não cookie.
export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "600",
};
