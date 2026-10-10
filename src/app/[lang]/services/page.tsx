import type { Metadata } from "next";
import Contact from "@/components/Contact";
import Services from "@/components/Services";
import SiteNav from "@/components/SiteNav";
import { pageMetadata } from "@/content/metadata";
import { isLocale } from "@/content/site";
import { servicesStructuredData } from "@/content/structuredData";

interface Props {
  params: Promise<{ lang: string }>;
}

/* Served at /services and /es/servicios through the proxy */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata("services", isLocale(lang) ? lang : "en");
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesStructuredData(locale)).replace(/</g, "\\u003c"),
        }}
      />
      <SiteNav page="services" />
      <main id="main">
        <Services />
      </main>
      <Contact page="services" />
    </>
  );
}
