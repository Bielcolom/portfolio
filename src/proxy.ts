import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, LOCALE_COOKIE, PAGES, PAGE_PATH, PAGE_ROUTE, PageKey, isLocale } from "@/content/site";
import type { Locale } from "@/i18n/translations";

/** The first language in Accept-Language that the site speaks. Catalan reads the Spanish page */
function preferred(header: string | null): Locale {
  if (!header) return "en";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag, q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter((lang) => lang.tag && !Number.isNaN(lang.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag.startsWith("es") || tag.startsWith("ca")) return "es";
    if (tag.startsWith("en")) return "en";
  }
  return "en";
}

/* Public address → the page, its language and the [lang] route that renders it.
   Internal routes that differ from their public address → that address */
const PUBLIC = new Map<string, { page: PageKey; locale: Locale; route: string }>();
const INTERNAL = new Map<string, string>();
for (const page of PAGES) {
  for (const locale of LOCALES) {
    const address = PAGE_PATH[page][locale];
    const route = `/${locale}${PAGE_ROUTE[page]}`;
    PUBLIC.set(address, { page, locale, route });
    if (route !== address) INTERNAL.set(route, address);
  }
}

/**
 * Each page has an English and a Spanish address ("/" and "/es", "/services"
 * and "/es/servicios"); the English ones are served from /en through a
 * rewrite, and the internal routes redirect to the public addresses so no
 * page is indexed twice. A visitor who arrives at an English address with a
 * Spanish or Catalan browser is sent to its Spanish twin, unless they once
 * chose a language with the toggle. Links inside the site never redirect:
 * the visitor keeps the language they are reading. Crawlers send no language
 * preference, so they get English here and find Spanish through hreflang.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  const address = INTERNAL.get(url.pathname);
  if (address) {
    url.pathname = address;
    return NextResponse.redirect(url, 308);
  }

  const target = PUBLIC.get(url.pathname);
  if (!target) return NextResponse.next();

  const arriving = request.headers.get("sec-fetch-site") !== "same-origin";
  if (target.locale === "en" && arriving) {
    const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale = isLocale(chosen) ? chosen : preferred(request.headers.get("accept-language"));
    if (locale === "es") {
      url.pathname = PAGE_PATH[target.page].es;
      return NextResponse.redirect(url);
    }
  }

  if (target.route === url.pathname) return NextResponse.next();
  url.pathname = target.route;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/", "/en", "/services", "/en/services", "/es/services", "/es/servicios"],
};
