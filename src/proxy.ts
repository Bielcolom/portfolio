import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, isLocale } from "@/content/site";

/** The first language in Accept-Language that the site speaks. Catalan reads the Spanish page */
function preferred(header: string | null): "en" | "es" {
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

/**
 * "/" is the English page (an internal rewrite to /en) and "/es" the Spanish
 * one, each with its own address for search engines. A visitor who lands on
 * "/" with a Spanish or Catalan browser is sent to /es, unless they once
 * chose a language with the toggle. Crawlers send no language preference, so
 * they get English here and find Spanish through hreflang.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname === "/en") {
    url.pathname = "/";
    return NextResponse.redirect(url, 308);
  }

  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(chosen) ? chosen : preferred(request.headers.get("accept-language"));

  if (locale === "es") {
    url.pathname = "/es";
    return NextResponse.redirect(url);
  }

  url.pathname = "/en";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/", "/en"],
};
