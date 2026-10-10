import type { Metadata } from "next";
import { Locale, Translations, translations } from "@/i18n/translations";
import { PAGE_PATH, PageKey } from "./site";

const OG_LOCALE: Record<Locale, string> = { en: "en_IE", es: "es_ES" };

/** The title and snippet a page shows in search results, tabs and link previews */
export const pageSeo = (page: PageKey, t: Translations) => (page === "services" ? t.services.seo : t.seo);

/**
 * A page's own metadata in one language: canonical address, its twin in the
 * other language (hreflang, with English as the default) and Open Graph.
 * The preview image comes from [lang]/opengraph-image.tsx.
 */
export function pageMetadata(page: PageKey, locale: Locale): Metadata {
  const { title, description } = pageSeo(page, translations[locale]);
  const paths = PAGE_PATH[page];
  const other: Locale = locale === "en" ? "es" : "en";
  const shared = {
    url: paths[locale],
    siteName: "Gabriel Colom Moll",
    title,
    description,
    locale: OG_LOCALE[locale],
    alternateLocale: [OG_LOCALE[other]],
  };

  return {
    title,
    description,
    alternates: {
      canonical: paths[locale],
      languages: { en: paths.en, es: paths.es, "x-default": paths.en },
    },
    openGraph: page === "home"
      ? { ...shared, type: "profile", firstName: "Gabriel", lastName: "Colom Moll", username: "Bielcolom" }
      : { ...shared, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
