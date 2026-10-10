import { EMAIL, PROFILE_LINKS } from "@/content/links";
import { LOCALE_PATH, SITE_URL } from "@/content/site";
import { en, es } from "@/i18n/translations";

export const dynamic = "force-static";

const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

/**
 * /llms.txt: the page in plain Markdown, for AI assistants that read it
 * instead of the HTML. Built from the same strings as the site, so the two
 * never disagree.
 */
export function GET() {
  const body = `# Gabriel Colom Moll

> ${en.seo.description}

Also known as Biel Colom. ${en.availability.status}: ${en.availability.where}. ${en.availability.detail}.

${en.about.statement}

## Contact

${list([
  `Email: ${EMAIL}`,
  ...PROFILE_LINKS.map((link) => `${link.name}: ${link.url}`),
  `CV in English (PDF): ${SITE_URL}${en.cv.href}`,
  `CV in Spanish (PDF): ${SITE_URL}${es.cv.href}`,
])}

## Pages

- [Portfolio in English](${SITE_URL}${LOCALE_PATH.en})
- [Portfolio en español](${SITE_URL}${LOCALE_PATH.es})

## ${en.about.title}

${list(en.about.facts.map((fact) => `${fact.label}: ${fact.value}`))}

## ${en.experience.title}

${list(en.experience.chapters.map((chapter) => `**${chapter.title}**: ${chapter.body} (${chapter.tags.join(", ")})`))}

${en.experience.also}

## Freelance services

${list(en.seo.services)}

## ${en.projects.title}

${list(en.projects.items.map((p) =>
  `**${p.name}** (${p.meta}): ${p.desc} Stack: ${p.tech.join(", ")}.${p.award ? ` ${p.award}.` : ""}${p.href ? ` Code: ${p.href}` : ""}`,
))}

## ${en.stack.title}

${list(en.stack.groups.map((group) => `${group.name}: ${group.items.join(", ")}`))}

## ${en.education.title}

${list([
  ...en.education.entries.map((entry) =>
    `${entry.period}: ${entry.title}, ${entry.school}.${entry.note ? ` ${entry.note}` : ""}`,
  ),
  `${en.education.awardTitle}: ${en.education.award}`,
  `${en.education.trainingTitle}: ${en.education.training.join("; ")}`,
])}

## En español

> ${es.seo.description}

${es.about.statement}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
