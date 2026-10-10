import type { Locale } from "@/i18n/translations";

/** The canonical origin: gcolom.com redirects here */
export const SITE_URL = "https://www.gcolom.com";

export const LOCALES: Locale[] = ["en", "es"];

export type PageKey = "home" | "services";

/** Each page's public address in each language, rendered on the server in
    that language. Spanish addresses use Spanish words */
export const PAGE_PATH: Record<PageKey, Record<Locale, string>> = {
  home: { en: "/", es: "/es" },
  services: { en: "/services", es: "/es/servicios" },
};

/** Where each page lives under app/[lang]; the proxy maps public addresses onto it */
export const PAGE_ROUTE: Record<PageKey, string> = { home: "", services: "/services" };

export const PAGES = Object.keys(PAGE_PATH) as PageKey[];

/** The page a public address belongs to, in either language */
export const pageAt = (pathname: string): PageKey =>
  PAGES.find((page) => LOCALES.some((locale) => PAGE_PATH[page][locale] === pathname)) ?? "home";

/** Remembers an explicit choice, so the proxy stops guessing from Accept-Language */
export const LOCALE_COOKIE = "locale";

export const isLocale = (value: string | undefined): value is Locale =>
  value === "en" || value === "es";
