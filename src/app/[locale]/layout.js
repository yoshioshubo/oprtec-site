import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import WhatsAppButton from "@/components/WhatsAppButton";
import { obterContatos } from "@/lib/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Contatos (WhatsApp, e-mail) vêm do Firestore e são editados em /admin: as páginas
// continuam estáticas, mas são regeneradas no máximo a cada 60s pra refletir mudanças.
export const revalidate = 60;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Renderiza estático em vez de dinâmico por request — sem isso, toda página
  // vira SSR sob demanda só porque está dentro de [locale].
  setRequestLocale(locale);
  const contatos = await obterContatos();
  const tw = await getTranslations({ locale, namespace: "whatsapp" });

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer contatos={contatos} />
          <WhatsAppButton
            numero={contatos.whatsappNumero}
            mensagem={contatos.whatsappMensagem[locale] || tw("mensagem")}
            label={tw("label")}
          />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
