export const metadata = {
  title: "Política de Privacidade — OPRtec",
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        Documentos legais
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
        Política de Privacidade
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Última atualização: 23 de agosto de 2026.
      </p>

      <div className="mt-10 space-y-8 text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            1. Quem somos
          </h2>
          <p className="mt-2 leading-relaxed">
            Esta Política de Privacidade descreve como a{" "}
            <strong>OPRtec</strong> (<strong>OPR CONSULTORIA LTDA</strong>,
            CNPJ <strong>67.665.959/0001-17</strong>, com sede na Rua Doutor
            Donato Pinto, 598, Parque Imperial), na qualidade de
            controladora de dados, coleta, usa e protege os dados pessoais
            de visitantes e clientes deste site, em conformidade com a Lei
            Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            2. Quais dados coletamos
          </h2>
          <p className="mt-2 leading-relaxed">
            Coletamos apenas o estritamente necessário para atender ao seu
            pedido de contato ou processar sua assinatura:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
            <li>
              <strong>Formulário de contato:</strong> nome, nome do
              estabelecimento, WhatsApp e a mensagem que você escrever.
            </li>
            <li>
              <strong>Checkout / assinatura:</strong> nome, CPF ou CNPJ,
              e-mail e os dados do cartão de crédito — estes últimos são
              inseridos diretamente na tela segura do Mercado Pago e nunca
              chegam aos nossos servidores; recebemos apenas um token de
              autorização de cobrança.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            3. Para que usamos seus dados
          </h2>
          <p className="mt-2 leading-relaxed">
            Usamos seus dados para: responder seu contato, processar
            pagamento e faturamento, liberar o acesso aos módulos
            contratados, dar suporte e cumprir obrigações legais e fiscais.
            Só enviamos e-mails de ofertas ou novidades se você marcar
            expressamente essa opção no momento do cadastro.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            4. Onde seus dados ficam armazenados
          </h2>
          <p className="mt-2 leading-relaxed">
            Os dados enviados pelo formulário de contato ficam armazenados
            no Firebase (Google Cloud). Os dados de pagamento são
            processados e armazenados pelo Mercado Pago, operador de
            pagamentos certificado PCI-DSS — a OPRtec não tem acesso ao
            número completo do seu cartão.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            5. Por quanto tempo guardamos
          </h2>
          <p className="mt-2 leading-relaxed">
            Mantemos seus dados pelo tempo necessário para cumprir a
            finalidade para a qual foram coletados e as obrigações legais e
            fiscais aplicáveis (como guarda de notas fiscais), podendo ser
            excluídos mediante solicitação, quando não houver base legal
            para retenção.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            6. Com quem compartilhamos
          </h2>
          <p className="mt-2 leading-relaxed">
            Compartilhamos dados apenas com prestadores necessários à
            operação do serviço: Mercado Pago (processamento de
            pagamentos), Firebase/Google Cloud (armazenamento de leads) e,
            quando aplicável, um emissor de nota fiscal eletrônica. Não
            vendemos seus dados a terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            7. Cookies
          </h2>
          <p className="mt-2 leading-relaxed">
            Este site utiliza apenas cookies essenciais ao seu
            funcionamento. Caso venhamos a utilizar cookies de terceiros
            para análise de tráfego ou publicidade (como Meta ou Google), o
            banner de cookies exibido na sua primeira visita permitirá que
            você aceite ou rejeite os cookies não essenciais antes de
            continuar navegando.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            8. Seus direitos como titular de dados
          </h2>
          <p className="mt-2 leading-relaxed">
            Nos termos da LGPD, você pode solicitar a qualquer momento:
            confirmação da existência de tratamento, acesso, correção,
            anonimização, portabilidade, eliminação dos dados, informação
            sobre compartilhamento e revogação do consentimento dado.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            9. Como exercer seus direitos
          </h2>
          <p className="mt-2 leading-relaxed">
            Envie sua solicitação para{" "}
            <a
              href="mailto:oprconsultorias@gmail.com"
              className="text-cyan-600 hover:text-cyan-700"
            >
              oprconsultorias@gmail.com
            </a>
            . Responderemos dentro do prazo legal aplicável.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            10. Alterações nesta Política
          </h2>
          <p className="mt-2 leading-relaxed">
            Podemos atualizar esta Política periodicamente. A data da
            última atualização está sempre indicada no topo desta página.
          </p>
        </section>
      </div>
    </div>
  );
}
