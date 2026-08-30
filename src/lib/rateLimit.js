// Rate limit simples em memória, por IP — protege /api/assinar contra "card testing"
// (bot testando muitos cartões roubados até achar um que funcione). Em memória porque
// rodamos numa única instância no Railway; se um dia escalar pra múltiplas instâncias,
// isso precisa virar algo compartilhado (Redis, etc).
const tentativasPorIp = new Map();

const JANELA_MS = 15 * 60 * 1000;
const LIMITE = 5;

// Limpa entradas antigas de tempos em tempos pra não vazar memória indefinidamente.
setInterval(() => {
  const agora = Date.now();
  for (const [ip, dados] of tentativasPorIp) {
    if (agora > dados.resetAt) tentativasPorIp.delete(ip);
  }
}, JANELA_MS).unref?.();

export function obterIpCliente(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "desconhecido";
}

// Retorna { permitido: boolean, restante: number }.
export function verificarLimite(ip, { limite = LIMITE, janelaMs = JANELA_MS } = {}) {
  const agora = Date.now();
  const dados = tentativasPorIp.get(ip);

  if (!dados || agora > dados.resetAt) {
    tentativasPorIp.set(ip, { count: 1, resetAt: agora + janelaMs });
    return { permitido: true, restante: limite - 1 };
  }

  if (dados.count >= limite) {
    return { permitido: false, restante: 0 };
  }

  dados.count += 1;
  return { permitido: true, restante: limite - dados.count };
}
