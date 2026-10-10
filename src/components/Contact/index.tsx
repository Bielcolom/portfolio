"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/components/ArrowIcon";
import LocalTime from "@/components/LocalTime";
import Magnetic from "@/components/Magnetic";
import Reveal from "@/components/Reveal";
import { scrollToTarget } from "@/components/SmoothScroll";
import TextRoll from "@/components/TextRoll";
import { EMAIL, PROFILE_LINKS, mailto } from "@/content/links";
import { useLanguage } from "@/i18n/context";
import styles from "./contact.module.scss";

/**
 * The close. It rises out from under the record above it and asks the two
 * questions the site answers. Each answer opens an email already written for
 * that visitor, so writing takes a click and a few blanks. Copy stays beside
 * it: mailto does nothing where there is no mail app (LinkedIn's in-app
 * browser, many work laptops), and once a draft has been opened the page
 * says so.
 */
const Contact = () => {
  const { locale, t } = useLanguage();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
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

          <div className={styles.intents}>
            <div className={styles.intentButtons}>
              {t.contact.intents.map((intent) => (
                <Magnetic key={intent.label}>
                  <a href={mailto(intent)} className={styles.intent} onClick={() => setOpened(true)}>
                    <TextRoll text={intent.label} />
                    <ArrowIcon className={styles.intentArrow} />
                  </a>
                </Magnetic>
              ))}
            </div>
            <p className={styles.intentsNote}>{t.contact.intentsNote}</p>
          </div>

          <div className={styles.grid}>
            <div className={styles.reach}>
              <p className={styles.body}>{t.contact.body}</p>
              <div className={styles.emailRow}>
                <a href={mailto(t.mail)} className={styles.email} onClick={() => setOpened(true)}>
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
              <p className={styles.fallback} aria-live="polite">
                {opened && <span className={styles.fallbackText}>{t.contact.fallback}</span>}
              </p>
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
