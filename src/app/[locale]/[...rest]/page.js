import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

// Rota coringa: o Next so usa o not-found.js de um segmento quando alguem chama
// notFound() dentro dele. Uma URL desconhecida nao entra em nenhum segmento e caia
// na tela padrao do Next (em ingles, sem cabecalho). Com este catch-all, qualquer
// endereco invalido entra em [locale], chama notFound() e renderiza o 404 traduzido.
export default async function RotaInexistente({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
