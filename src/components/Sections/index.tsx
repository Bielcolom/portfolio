"use client";
import { MENU_ITEMS } from "@/components/HeroFaceLanding/data";
import { useLanguage } from "@/i18n/context";
import styles from "./sections.module.scss";

const CONTACT_LINKS = [
  { name: "Email", handle: "gabrielcolomoll@gmail.com", url: "mailto:gabrielcolomoll@gmail.com" },
  { name: "GitHub", handle: "github.com/Bielcolom", url: "https://github.com/Bielcolom" },
  { name: "LinkedIn", handle: "gabriel-colom-moll", url: "https://www.linkedin.com/in/gabriel-colom-moll/" },
];

const Sections = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.sections}>
      {MENU_ITEMS.map((item, i) => {
        const s = t.sections[item.id as keyof typeof t.sections];
        return (
          <section key={item.id} id={item.id} className={styles.section}>
            <span className={styles.path}>~/portfolio/{item.id}.md</span>
            <h2 className={styles.title}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>

            {s.body.map((p, j) => (
              <p key={j} className={styles.paragraph}>
                {p}
              </p>
            ))}

            {item.id === "contact" && (
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
            )}
          </section>
        );
      })}
    </div>
  );
};

export default Sections;
