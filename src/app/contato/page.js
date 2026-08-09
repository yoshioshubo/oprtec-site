export const metadata = {
  title: "Contato — OPRtec",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        Fale com a gente
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
        Agende uma conversa
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Conte um pouco sobre o seu bar ou restaurante e entramos em contato.
      </p>

      <form className="mt-10 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="nome">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="estabelecimento"
          >
            Nome do estabelecimento
          </label>
          <input
            id="estabelecimento"
            name="estabelecimento"
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="whatsapp">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="mensagem">
            Qual o principal desafio hoje?
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <button
          type="submit"
          disabled
          className="w-full cursor-not-allowed rounded-full bg-cyan-600/50 px-6 py-3 text-sm font-semibold text-white"
          title="Envio será habilitado quando o formulário for conectado ao webhook do n8n"
        >
          Enviar (aguardando integração)
        </button>
      </form>
    </div>
  );
}
