import type { Metadata, Viewport } from "next";
import { Hubot_Sans, Mona_Sans } from "next/font/google";
import "./styles/globals.scss";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
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

/* What a recruiter sees in a tab strip and a LinkedIn preview — the server renders English */
const TITLE = "Gabriel Colom Moll · Full-stack developer";
const DESCRIPTION =
  "Full-stack developer in Palma de Mallorca: web and mobile products end to end, with AI features that act on real data. Open to new roles in Ireland, Spain or remote, and to freelance projects.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "profile",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
};

/* Marks the document before first paint so scroll reveals can start hidden.
   If the client never takes over, the flag is withdrawn and everything shows */
const JS_FLAG = `(function(d){d.classList.add("js");setTimeout(function(){if(!d.dataset.ready)d.classList.remove("js")},5000)})(document.documentElement)`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>
        <LanguageProvider>
          <SmoothScroll />
          {children}
          <Cursor />
        </LanguageProvider>
      </body>
    </html>
  );
}
