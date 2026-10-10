"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/components/ArrowIcon";
import LocalTime from "@/components/LocalTime";
import Magnetic from "@/components/Magnetic";
import Reveal from "@/components/Reveal";
import { scrollToTarget } from "@/components/SmoothScroll";
import TextRoll from "@/components/TextRoll";
import { EMAIL, PROFILE_LINKS } from "@/content/links";
import { useLanguage } from "@/i18n/context";
import styles from "./contact.module.scss";

/**
 * The close. It rises out from under the record above it, restates the
 * availability at display size and puts the email first: copy works where
 * mailto does not (LinkedIn's in-app browser, most work laptops).
 */
const Contact = () => {
  const { locale, t } = useLanguage();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rise = useTransform(scrollYProgress, (p) => `translate3d(0, ${(1 - p) * -28}%, 0)`);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL).then(() => setCopied(true), () => {});
  };

  const toTop = () => scrollToTarget(0);

  return (
    <footer ref={ref} id="footer" className={styles.footer}>
      <motion.div className={styles.inner} style={{ transform: reduce ? undefined : rise }}>
        <section id="contact" className={styles.contact} aria-labelledby="contact-title">
          <h2 id="contact-title" className={styles.title}>
            {t.contact.titleLines.map((line, i) => (
              <Reveal key={line} as="span" text={line} className={styles.titleLine} delay={i ? "short" : "none"} />
            ))}
          </h2>

          <div className={styles.grid}>
            <div className={styles.reach}>
              <p className={styles.body}>{t.contact.body}</p>
              <div className={styles.emailRow}>
                <a href={`mailto:${EMAIL}`} className={styles.email}>
                  <TextRoll text={EMAIL} />
                </a>
                <Magnetic>
                  <button type="button" onClick={copyEmail} className={styles.copy} data-copied={copied || undefined}>
                    <span className={styles.copyIdle}>{t.contact.copy}</span>
                    <span className={styles.copyDone} aria-hidden>{t.contact.copied}</span>
                  </button>
                </Magnetic>
                <span className={styles.srOnly} role="status">{copied ? t.contact.copied : ""}</span>
              </div>
            </div>

            <div className={styles.aside}>
              <ul className={styles.links}>
                {PROFILE_LINKS.map((link) => (
                  <li key={link.name}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      <span className={styles.linkName}><TextRoll text={link.name} /></span>
                      <span className={styles.linkHandle}>{link.handle}</span>
                      <ArrowIcon className={styles.arrow} />
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={t.cv.href}
                    hrefLang={locale}
                    type="application/pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span className={styles.linkName}><TextRoll text={t.cv.label} /></span>
                    <span className={styles.linkHandle}>{t.cv.handle}</span>
                    <ArrowIcon className={styles.arrow} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Gabriel Colom Moll</p>
          <LocalTime label={t.nav.localTime} />
          <p>{t.contact.built}</p>
          <button type="button" onClick={toTop} className={styles.top}>
            <TextRoll text={t.contact.top} />
          </button>
        </div>
      </motion.div>
    </footer>
  );
};

export default Contact;
