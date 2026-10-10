import type { MetadataRoute } from "next";
import { LOCALES, PAGES, PAGE_PATH, SITE_URL } from "@/content/site";

const PRIORITY = { home: 1, services: 0.8 };

/* Every page in both languages, each naming its twin as the alternate */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) => {
    const languages = Object.fromEntries(
      LOCALES.map((locale) => [locale, `${SITE_URL}${PAGE_PATH[page][locale]}`]),
    );
    return LOCALES.map((locale) => ({
      url: `${SITE_URL}${PAGE_PATH[page][locale]}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: PRIORITY[page],
      alternates: { languages },
    }));
  });
}
