import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contato — OPRtec",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-6">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
        Fale com a gente
      </span>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
        Agende uma conversa
      </h1>
      <p className="mt-3 text-lg text-slate-600">Entre em contato.</p>

      <ContactForm />
    </div>
  );
}
