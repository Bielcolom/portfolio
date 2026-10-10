import { Locale, translations } from "@/i18n/translations";
import { EMAIL, PROFILE_LINKS } from "./links";
import { PAGE_PATH, SITE_URL } from "./site";

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const SKILLS = [
  "Full-stack development",
  "Web development",
  "Mobile app development",
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "React Native",
  "Expo",
  "MongoDB",
  "GraphQL",
  "PostgreSQL",
  "AI agents",
  "LLM integration",
  "Stripe",
  "Single sign-on",
  "Internationalization",
];

/** Where he takes freelance work: home first, then the two markets he targets */
const AREA_SERVED = [
  { "@type": "City", name: "Palma de Mallorca" },
  { "@type": "AdministrativeArea", name: "Illes Balears" },
  { "@type": "Country", name: "Spain" },
  { "@type": "Country", name: "Ireland" },
];

const pageUrl = (page: keyof typeof PAGE_PATH, locale: Locale) => `${SITE_URL}${PAGE_PATH[page][locale]}`;

/** Each freelance offer as a service he provides, described on the services page */
const services = (locale: Locale) =>
  translations[locale].services.offers.map((offer, i) => ({
    "@type": "Service",
    "@id": `${pageUrl("services", locale)}#service-${i + 1}`,
    name: offer.title,
    serviceType: offer.title,
    description: offer.body,
    url: pageUrl("services", locale),
    provider: { "@id": PERSON_ID },
    areaServed: AREA_SERVED,
    availableLanguage: ["es", "ca", "en"],
  }));

/**
 * The home page described for search engines and AI assistants: a profile
 * page whose subject is the person, with what he does, where, the languages
 * he speaks, his profiles elsewhere and the services he offers as a
 * freelancer. Every fact here is also on the page or in the CV.
 */
export function structuredData(locale: Locale) {
  const t = translations[locale];
  const url = pageUrl("home", locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${url}#profile`,
        url,
        name: t.seo.title,
        description: t.seo.description,
        inLanguage: locale,
        mainEntity: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: "Gabriel Colom Moll",
        inLanguage: ["en", "es"],
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Gabriel Colom Moll",
        alternateName: "Biel Colom",
        givenName: "Gabriel",
        familyName: "Colom Moll",
        jobTitle: t.seo.jobTitle,
        description: t.seo.description,
        // One address for the person in both languages; the pages differ, the identity does not
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/hero-last.jpg`,
        email: `mailto:${EMAIL}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Palma de Mallorca",
          addressRegion: "Illes Balears",
          addressCountry: "ES",
        },
        nationality: { "@type": "Country", name: "Spain" },
        knowsLanguage: [
          { "@type": "Language", name: "Spanish", alternateName: "es" },
          { "@type": "Language", name: "Catalan", alternateName: "ca" },
          { "@type": "Language", name: "English", alternateName: "en" },
        ],
        knowsAbout: SKILLS,
        worksFor: { "@type": "Organization", name: "WOZZO", url: "https://wozzo.es" },
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "Universitat Oberta de Catalunya" },
          { "@type": "EducationalOrganization", name: "Col·legi Sant Josep Obrer" },
        ],
        award: t.education.award,
        sameAs: PROFILE_LINKS.map((link) => link.url),
        makesOffer: services(locale).map((service) => ({ "@type": "Offer", itemOffered: { "@id": service["@id"] } })),
      },
      ...services(locale),
    ],
  };
}

/**
 * The services page: a page of questions and answers about working with him,
 * placed under the home page, with each kind of work as a service he
 * provides. The person is the one described in full on the home page.
 */
export function servicesStructuredData(locale: Locale) {
  const t = translations[locale];
  const url = pageUrl("services", locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${url}#webpage`,
        url,
        name: t.services.seo.title,
        description: t.services.seo.description,
        inLanguage: locale,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": PERSON_ID },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: t.services.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Gabriel Colom Moll", item: pageUrl("home", locale) },
          { "@type": "ListItem", position: 2, name: t.services.nav, item: url },
        ],
      },
      ...services(locale),
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Gabriel Colom Moll",
        jobTitle: t.seo.jobTitle,
        url: `${SITE_URL}/`,
        sameAs: PROFILE_LINKS.map((link) => link.url),
      },
    ],
  };
}
