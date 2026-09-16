import { NextResponse } from "next/server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { getTranslations } from "next-intl/server";
import { planos, precoTotalAnual } from "@/data/planos";
import { obterIpCliente, verificarLimite } from "@/lib/rateLimit";
import { routing } from "@/i18n/routing";

const SITE_URL = "https://www.oprtec.com.br";
const TRIAL_DAYS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const ip = obterIpCliente(request);
  const { permitido } = verificarLimite(ip);

  // Corpo malformado vinha como exceção não tratada e virava 500 (erro "nosso"),
  // quando na verdade é requisição inválida do cliente.
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const {
    plano: slug,
    ciclo,
    cardTokenId,
    email,
    nomeEstabelecimento,
    aceitouTermos,
    locale: localeBruto,
  } = body;

  const locale = routing.locales.includes(localeBruto)
    ? localeBruto
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "checkoutApi" });

  if (!permitido) {
    return NextResponse.json({ error: t("muitasTentativas") }, { status: 429 });
  }

  const plano = planos.find((p) => p.slug === slug);
  if (!plano) {
    return NextResponse.json({ error: t("planoInvalido") }, { status: 400 });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: t("emailInvalido") }, { status: 400 });
  }

  if (!aceitouTermos) {
    return NextResponse.json(
      { error: t("precisaAceitarTermos") },
      { status: 400 }
    );
  }

  const nomeLimpo = String(nomeEstabelecimento || "").trim().replace(/::/g, "-").slice(0, 80);
  if (!nomeLimpo) {
    return NextResponse.json(
      { error: t("informeEstabelecimento") },
      { status: 400 }
    );
  }

  const anual = ciclo === "anual";
  const autoRecurring = anual
    ? {
        frequency: 12,
        frequency_type: "months",
        transaction_amount: precoTotalAnual(plano.preco),
        currency_id: "BRL",
        free_trial: {
          frequency: TRIAL_DAYS,
          frequency_type: "days",
        },
      }
    : {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: plano.preco,
        currency_id: "BRL",
        free_trial: {
          frequency: TRIAL_DAYS,
          frequency_type: "days",
        },
      };

  if (!cardTokenId) {
    return NextResponse.json(
      { error: t("dadosCartaoAusentes") },
      { status: 400 }
    );
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { error: t("pagamentoNaoConfigurado") },
      { status: 500 }
    );
  }

  const client = new MercadoPagoConfig({ accessToken });
  const preApproval = new PreApproval(client);

  try {
    const result = await preApproval.create({
      body: {
        reason: `Plano ${plano.slug} — OPRtec (${anual ? "anual" : "mensal"})`,
        // Formato "slug::nome do estabelecimento" — o webhook em integracoes-gateway
        // usa isso pra saber qual plano liberar e, se o cliente ainda não existir,
        // com que nome criar o cadastro automaticamente.
        external_reference: `${plano.slug}::${nomeLimpo}`,
        payer_email: email,
        card_token_id: cardTokenId,
        auto_recurring: autoRecurring,
        back_url: `${SITE_URL}/checkout/sucesso`,
        status: "authorized",
      },
    });

    return NextResponse.json({ id: result.id, status: result.status });
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    return NextResponse.json({ error: t("cartaoRecusado") }, { status: 400 });
  }
}
