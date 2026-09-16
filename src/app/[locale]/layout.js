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

const OG_LOCALE = { pt: "pt_BR", en: "en_US", es: "es_ES" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://www.oprtec.com.br"),
    icons: {
      icon: [
        {
          url: "/favicon.ico",
        },
        {
          url: "/icon-40x40.png",
          sizes: "40x40",
          type: "image/png",
        },
        {
          url: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
      shortcut: ["/favicon.ico"],
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    manifest: "/manifest.json",
    // Sem isso, um link do site compartilhado no WhatsApp/LinkedIn aparecia como
    // texto puro, sem título, descrição nem imagem.
    openGraph: {
      type: "website",
      siteName: "OPRtec",
      title: t("title"),
      description: t("description"),
      url: locale === "pt" ? "/" : `/${locale}`,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "OPRtec" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
    },
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
