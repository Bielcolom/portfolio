import { Locale, translations } from "@/i18n/translations";
import { EMAIL, PROFILE_LINKS } from "./links";
import { LOCALE_PATH, SITE_URL } from "./site";

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

/**
 * The page described for search engines and AI assistants: a profile page
 * whose subject is the person, with what he does, where, the languages he
 * speaks, his profiles elsewhere and the services he offers as a freelancer.
 * Every fact here is also on the page or in the CV.
 */
export function structuredData(locale: Locale) {
  const t = translations[locale];
  const url = `${SITE_URL}${LOCALE_PATH[locale]}`;

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
        makesOffer: t.seo.services.map((name) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name,
            provider: { "@id": PERSON_ID },
            areaServed: AREA_SERVED,
          },
        })),
      },
    ],
  };
}
