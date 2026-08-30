import { NextResponse } from "next/server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { planos, precoTotalAnual } from "@/data/planos";
import { obterIpCliente, verificarLimite } from "@/lib/rateLimit";

const SITE_URL = "https://www.oprtec.com.br";
const TRIAL_DAYS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const ip = obterIpCliente(request);
  const { permitido } = verificarLimite(ip);
  if (!permitido) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { plano: slug, ciclo, cardTokenId, email, nomeEstabelecimento, aceitouTermos } = body;

  const plano = planos.find((p) => p.slug === slug);
  if (!plano) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  if (!aceitouTermos) {
    return NextResponse.json(
      { error: "É necessário aceitar os Termos de Uso e a Política de Privacidade." },
      { status: 400 }
    );
  }

  const nomeLimpo = String(nomeEstabelecimento || "").trim().replace(/::/g, "-").slice(0, 80);
  if (!nomeLimpo) {
    return NextResponse.json(
      { error: "Informe o nome do estabelecimento." },
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
      { error: "Dados do cartão ausentes." },
      { status: 400 }
    );
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      {
        error:
          "Pagamento ainda não configurado. Defina MERCADOPAGO_ACCESS_TOKEN nas variáveis de ambiente.",
      },
      { status: 500 }
    );
  }

  const client = new MercadoPagoConfig({ accessToken });
  const preApproval = new PreApproval(client);

  try {
    const result = await preApproval.create({
      body: {
        reason: `Plano ${plano.nome} — OPRtec (${anual ? "anual" : "mensal"})`,
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
    return NextResponse.json(
      { error: "O Mercado Pago recusou os dados do cartão. Confira e tente de novo." },
      { status: 400 }
    );
  }
}
