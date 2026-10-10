import type { MetadataRoute } from "next";
import { LOCALES, LOCALE_PATH, SITE_URL } from "@/content/site";

/* One entry per language, each naming the other as its alternate */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, `${SITE_URL}${LOCALE_PATH[locale]}`]),
  );

  return LOCALES.map((locale) => ({
    url: `${SITE_URL}${LOCALE_PATH[locale]}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}
