"use client";
import { motion } from "framer-motion";
import { MENU_ITEMS } from "@/components/HeroFaceLanding/data";
import { useLanguage } from "@/i18n/context";
import { SectionId, Translations } from "@/i18n/translations";
import styles from "./sections.module.scss";

const CONTACT_LINKS = [
  { name: "Email", handle: "gabrielcolomoll@gmail.com", url: "mailto:gabrielcolomoll@gmail.com" },
  { name: "GitHub", handle: "github.com/Bielcolom", url: "https://github.com/Bielcolom" },
  { name: "LinkedIn", handle: "gabriel-colom-moll", url: "https://www.linkedin.com/in/gabriel-colom-moll/" },
];

const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 0.84, 0.39, 1] as const },
};

const About = ({ s }: { s: Translations["sections"]["about"] }) => (
  <>
    {s.body.map((p, i) => (
      <p key={i} className={styles.paragraph} data-lede={i === 0 || undefined}>
        {p}
      </p>
    ))}
  </>
);

const Experience = ({ s }: { s: Translations["sections"]["experience"] }) => (
  <>
    {s.entries.map((entry) => (
      <div key={entry.company} className={styles.card}>
        <div className={styles.xpHeader}>
          <div>
            <h3 className={styles.xpRole}>{entry.role}</h3>
            <span className={styles.xpCompany}>{entry.company}</span>
          </div>
          <div className={styles.xpMeta}>
            <span className={styles.badge}>{entry.period}</span>
            <span className={styles.xpLocation}>{entry.location}</span>
          </div>
        </div>
        <ul className={styles.bullets}>
          {entry.bullets.map((b, i) => (
            <li key={i} className={styles.bullet}>{b}</li>
          ))}
        </ul>
      </div>
    ))}
  </>
);

const Projects = ({ s }: { s: Translations["sections"]["projects"] }) => (
  <div className={styles.projectsGrid}>
    {s.items.map((project) => (
      <article key={project.name} className={`${styles.card} ${styles.projectCard}`}>
        {project.award && <span className={styles.award}>★ {project.award}</span>}
        <h3 className={styles.projectName}>{project.name}</h3>
        <p className={styles.projectDesc}>{project.desc}</p>
        <div className={styles.tags}>
          {project.tech.map((tech) => (
            <span key={tech} className={styles.tag}>{tech}</span>
          ))}
        </div>
      </article>
    ))}
  </div>
);

const Stack = ({ s }: { s: Translations["sections"]["stack"] }) => (
  <div className={styles.stackGrid}>
    {s.groups.map((group) => (
      <div key={group.name} className={styles.stackGroup}>
        <span className={styles.stackName}>{group.name}</span>
        <div className={styles.tags}>
          {group.items.map((item) => (
            <span key={item} className={styles.tag}>{item}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Education = ({ s }: { s: Translations["sections"]["education"] }) => (
  <div className={styles.eduList}>
    {s.entries.map((entry) => (
      <div key={entry.title} className={styles.eduItem}>
        <div className={styles.eduInfo}>
          <h3 className={styles.eduTitle}>{entry.title}</h3>
          <span className={styles.eduSchool}>{entry.school}</span>
          {entry.note && <span className={styles.eduNote}>{entry.note}</span>}
        </div>
        <span className={styles.badge}>{entry.period}</span>
      </div>
    ))}
  </div>
);

const Contact = ({ s }: { s: Translations["sections"]["contact"] }) => (
  <>
    {s.body.map((p, i) => (
      <p key={i} className={styles.paragraph}>{p}</p>
    ))}
    <div className={styles.links}>
      {CONTACT_LINKS.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target={link.url.startsWith("http") ? "_blank" : undefined}
          rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
          className={styles.link}
        >
          <span className={styles.linkName}>{link.name}</span>
          <span className={styles.linkHandle}>{link.handle}</span>
          <span aria-hidden className={styles.linkArrow}>→</span>
        </a>
      ))}
    </div>
  </>
);

const Sections = () => {
  const { t } = useLanguage();

  const bodyFor = (id: SectionId) => {
    switch (id) {
      case "about":      return <About s={t.sections.about} />;
      case "experience": return <Experience s={t.sections.experience} />;
      case "projects":   return <Projects s={t.sections.projects} />;
      case "stack":      return <Stack s={t.sections.stack} />;
      case "education":  return <Education s={t.sections.education} />;
      case "contact":    return <Contact s={t.sections.contact} />;
    }
  };

  return (
    <div className={styles.sections}>
      {MENU_ITEMS.map((item, i) => {
        const id = item.id as SectionId;
        return (
          <section key={id} id={id} className={styles.section}>
            <motion.div className={styles.sectionInner} {...REVEAL}>
              <h2 className={styles.title}>
                <span className={styles.num}>
                  {String(i + 1).padStart(2, "0")}
                  <span className={styles.numTotal}>/{String(MENU_ITEMS.length).padStart(2, "0")}</span>
                </span>
                {t.sections[id].title}
              </h2>
              {bodyFor(id)}
            </motion.div>
          </section>
        );
      })}
    </div>
  );
};

export default Sections;
