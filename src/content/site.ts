import type { Locale } from "@/i18n/translations";

/** The canonical origin: gcolom.com redirects here */
export const SITE_URL = "https://www.gcolom.com";

export const LOCALES: Locale[] = ["en", "es"];

/** Each language has its own address, rendered on the server in that language */
export const LOCALE_PATH: Record<Locale, string> = { en: "/", es: "/es" };

/** Remembers an explicit choice, so the proxy stops guessing from Accept-Language */
export const LOCALE_COOKIE = "locale";

export const isLocale = (value: string | undefined): value is Locale =>
  value === "en" || value === "es";
