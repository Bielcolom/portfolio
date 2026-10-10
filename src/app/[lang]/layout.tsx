import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Hubot_Sans, Mona_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import "../styles/globals.scss";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import { LOCALES, SITE_URL, isLocale } from "@/content/site";
import { LanguageProvider } from "@/i18n/context";

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

/* Every page exists in both languages, prerendered: English is served at its
   public address through the proxy, Spanish under /es */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/* Site-wide; each page adds its own title, description, canonical, hreflang
   and Open Graph through pageMetadata() */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Gabriel Colom Moll",
  authors: [{ name: "Gabriel Colom Moll", url: SITE_URL }],
  creator: "Gabriel Colom Moll",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

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
        {/* Visits, where they come from, and real visitors' loading speed.
            Cookieless, so no consent banner; both are switched on in the Vercel project */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
