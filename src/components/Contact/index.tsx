"use client";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import ArrowIcon from "@/components/ArrowIcon";
import LocalTime from "@/components/LocalTime";
import Magnetic from "@/components/Magnetic";
import Reveal from "@/components/Reveal";
import { scrollToTarget } from "@/components/SmoothScroll";
import TextRoll from "@/components/TextRoll";
import { EMAIL, FINE_POINTER, PROFILE_LINKS, gmailCompose, mailto, outlookCompose } from "@/content/links";
import { PAGE_PATH, PageKey } from "@/content/site";
import { useLanguage } from "@/i18n/context";
import { MailDraft, Translations } from "@/i18n/translations";
import styles from "./contact.module.scss";

type DraftKey = "role" | "project" | "generic";

const DRAFT_EVENT = "contact:draft";

/** Opens a draft's options in the contact block from elsewhere on the page.
    Call it inside the page change that brings the block into view */
export const openDraft = (key: DraftKey) =>
  window.dispatchEvent(new CustomEvent<DraftKey>(DRAFT_EVENT, { detail: key }));

const subscribePointer = (cb: () => void) => {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", cb);
  return () => query.removeEventListener("change", cb);
};

/** The server renders the phone behaviour (plain mailto); computers switch after hydration */
const useFinePointer = () =>
  useSyncExternalStore(subscribePointer, () => window.matchMedia(FINE_POINTER).matches, () => false);

/** Where to write a draft, on a computer: two webmails, the mail app, or the bare address */
const Compose = ({ id, draft, words, copyLabel, onMailApp, onCopy }: {
  id: string;
  draft: MailDraft;
  words: Translations["contact"]["compose"];
  copyLabel: string;
  onMailApp: () => void;
  onCopy: () => void;
}) => (
  <div id={id} className={styles.compose}>
    <span className={styles.composeLabel}>{words.label}</span>
    <ul className={styles.composeOptions}>
      <li>
        <a href={gmailCompose(draft)} target="_blank" rel="noopener noreferrer" className={styles.composeOption}>
          Gmail
          <ArrowIcon className={styles.composeArrow} />
        </a>
      </li>
      <li>
        <a href={outlookCompose(draft)} target="_blank" rel="noopener noreferrer" className={styles.composeOption}>
          Outlook
          <ArrowIcon className={styles.composeArrow} />
        </a>
      </li>
      <li>
        <a href={mailto(draft)} className={styles.composeOption} onClick={onMailApp}>
          {words.app}
        </a>
      </li>
      <li>
        <button type="button" className={styles.composeOption} onClick={onCopy}>
          {copyLabel}
        </button>
      </li>
    </ul>
  </div>
);

/**
 * The close, on ink after the raised sheet ends. It asks the two
 * questions the site answers. Each answer is an email already written for
 * that visitor, so writing takes a click and a few blanks. On a phone the
 * draft goes straight to the mail app. On a computer mailto often leads
 * nowhere (no mail app set up, or one since uninstalled), so the click
 * offers Gmail, Outlook, the mail app or the bare address instead.
 */
const Contact = ({ page = "home" }: { page?: PageKey }) => {
  const { locale, t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  const [draft, setDraft] = useState<DraftKey | null>(null);
  const fine = useFinePointer();

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  useEffect(() => {
    if (!draft) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDraft(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft]);

  /* Rendered at once, so a view transition that brings the block into view
     captures it with the options already open */
  useEffect(() => {
    const onDraft = (e: Event) => flushSync(() => setDraft((e as CustomEvent<DraftKey>).detail));
    window.addEventListener(DRAFT_EVENT, onDraft);
    return () => window.removeEventListener(DRAFT_EVENT, onDraft);
  }, []);

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL).then(() => setCopied(true), () => {});
  };

  const drafts: Record<DraftKey, MailDraft> = {
    role: t.contact.intents[0],
    project: t.contact.intents[1],
    generic: t.mail,
  };

  /* Phones: let mailto through. Computers: open the chooser for that draft */
  const choose = (key: DraftKey) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!fine) {
      setOpened(true);
      return;
    }
    e.preventDefault();
    setDraft((current) => (current === key ? null : key));
  };

  const disclosure = (key: DraftKey, controls: string) =>
    fine ? { "aria-expanded": draft === key, "aria-controls": controls } : {};

  const compose = (id: string, key: DraftKey) => (
    <Compose
      id={id}
      draft={drafts[key]}
      words={t.contact.compose}
      copyLabel={copied ? t.contact.copied : t.contact.compose.copy}
      onMailApp={() => setOpened(true)}
      onCopy={copyEmail}
    />
  );

  const toTop = () => scrollToTarget(0);

  return (
    <footer ref={ref} id="footer" className={styles.footer}>
      <div className={styles.inner}>
        <section id="contact" className={styles.contact} aria-labelledby="contact-title">
          <h2 id="contact-title" className={styles.title}>
            {/* The space never renders between block lines, but text-only
                readers would otherwise run "role" into "or" */}
            {t.contact.titleLines.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && " "}
                <Reveal as="span" text={line} className={styles.titleLine} delay={i ? "short" : "none"} />
              </Fragment>
            ))}
          </h2>

          <div className={styles.intents}>
            <div className={styles.intentButtons}>
              {t.contact.intents.map((intent, i) => {
                const key: DraftKey = i === 0 ? "role" : "project";
                return (
                  <Magnetic key={intent.label}>
                    <a
                      href={mailto(intent)}
                      className={styles.intent}
                      data-chosen={(fine && draft === key) || undefined}
                      onClick={choose(key)}
                      {...disclosure(key, "compose-intent")}
                    >
                      <TextRoll text={intent.label} />
                      <ArrowIcon className={styles.intentArrow} />
                    </a>
                  </Magnetic>
                );
              })}
            </div>
            {fine && (draft === "role" || draft === "project")
              ? compose("compose-intent", draft)
              : <p className={styles.intentsNote}>{t.contact.intentsNote}</p>}
            {page === "home" && (
              <Link href={PAGE_PATH.services[locale]} className={styles.services}>
                {t.contact.services}
                <ArrowIcon className={styles.servicesArrow} />
              </Link>
            )}
          </div>

          <div className={styles.grid}>
            <div className={styles.reach}>
              <p className={styles.body}>{t.contact.body}</p>
              <div className={styles.emailRow}>
                <a
                  href={mailto(t.mail)}
                  className={styles.email}
                  onClick={choose("generic")}
                  {...disclosure("generic", "compose-generic")}
                >
                  {EMAIL}
                </a>
                <Magnetic>
                  <button type="button" onClick={copyEmail} className={styles.copy} data-copied={copied || undefined}>
                    <span className={styles.copyIdle}>{t.contact.copy}</span>
                    <span className={styles.copyDone} aria-hidden>{t.contact.copied}</span>
                  </button>
                </Magnetic>
                <span className={styles.srOnly} role="status">{copied ? t.contact.copied : ""}</span>
              </div>
              {fine && draft === "generic" && compose("compose-generic", "generic")}
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
      </div>
    </footer>
  );
};

export default Contact;
