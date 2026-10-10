import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/* Every crawler is welcome, search engines and AI assistants alike */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
