import type { Metadata, Viewport } from "next";
import { Hubot_Sans, Mona_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import "../styles/globals.scss";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import { LOCALES, LOCALE_PATH, SITE_URL, isLocale } from "@/content/site";
import { LanguageProvider } from "@/i18n/context";
import { translations } from "@/i18n/translations";

/* Display: the name, headings and chrome. Text: everything read at length.
   Both carry a width axis, which the name's cursor pressure animates */
const display = Hubot_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
});

const text = Mona_Sans({
  variable: "--font-text",
  subsets: ["latin"],
  axes: ["wdth"],
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

/* Two static pages: /en (served at "/" through the proxy) and /es */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/* What a recruiter sees in a tab strip, a search result or a LinkedIn
   preview, and what search engines and AI read, in the page's language */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const { seo } = translations[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    applicationName: "Gabriel Colom Moll",
    authors: [{ name: "Gabriel Colom Moll", url: SITE_URL }],
    creator: "Gabriel Colom Moll",
    alternates: {
      canonical: LOCALE_PATH[locale],
      languages: { en: LOCALE_PATH.en, es: LOCALE_PATH.es, "x-default": LOCALE_PATH.en },
    },
    openGraph: {
      type: "profile",
      url: LOCALE_PATH[locale],
      siteName: "Gabriel Colom Moll",
      title: seo.title,
      description: seo.description,
      locale: locale === "es" ? "es_ES" : "en_IE",
      alternateLocale: locale === "es" ? ["en_IE"] : ["es_ES"],
      firstName: "Gabriel",
      lastName: "Colom Moll",
      username: "Bielcolom",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
};

/* Marks the document before first paint so scroll reveals can start hidden.
   If the client never takes over, the flag is withdrawn and everything shows */
const JS_FLAG = `(function(d){d.classList.add("js");setTimeout(function(){if(!d.dataset.ready)d.classList.remove("js")},5000)})(document.documentElement)`;

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>
        <LanguageProvider locale={lang}>
          <SmoothScroll />
          {children}
          <Cursor />
        </LanguageProvider>
      </body>
    </html>
  );
}
