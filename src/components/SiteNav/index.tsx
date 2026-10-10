"use client";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Availability from "@/components/Availability";
import CvLink from "@/components/CvLink";
import LangToggle from "@/components/LangToggle";
import LocalTime from "@/components/LocalTime";
import { jumpTo, lockScroll, scrollToTarget } from "@/components/SmoothScroll";
import TextRoll from "@/components/TextRoll";
import { EMAIL, FINE_POINTER, PROFILE_LINKS, mailto } from "@/content/links";
import { SECTIONS } from "@/content/sections";
import { PAGE_PATH, PageKey } from "@/content/site";
import { useLanguage } from "@/i18n/context";
import { SectionId } from "@/i18n/translations";
import styles from "./siteNav.module.scss";

/**
 * The fixed bar and the full-screen index it opens. The index grows out of
 * the menu button as a circle; choosing an entry swaps the page underneath
 * and wipes the destination up over it, like changing pages. Away from the
 * home page its sections are a real page change away; the contact block
 * closes every page, so it stays a jump.
 */
const SiteNav = ({ page = "home" }: { page?: PageKey }) => {
  const { locale, t } = useLanguage();
  const onHome = page === "home";
  const home = PAGE_PATH.home[locale];
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const [hidden, setHidden] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, (v) => `scaleX(${v})`);

  /* Out of the way while reading down, back as soon as the visitor scrolls up */
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > 240 && y > previous);
  });

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const page = document.querySelectorAll("#main, #footer");
    page.forEach((el) => el.setAttribute("inert", ""));
    const frame = requestAnimationFrame(() => firstLinkRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const button = buttonRef.current;
    return () => {
      lockScroll(false);
      page.forEach((el) => el.removeAttribute("inert"));
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      button?.focus({ preventScroll: true });
    };
  }, [open]);

  const toggle = () => {
    const button = buttonRef.current;
    const overlay = overlayRef.current;
    if (button && overlay) {
      const r = button.getBoundingClientRect();
      overlay.style.setProperty("--origin-x", `${r.left + r.width / 2}px`);
      overlay.style.setProperty("--origin-y", `${r.top + r.height / 2}px`);
    }
    setInstant(false);
    setOpen((o) => !o);
  };

  const go = (id: SectionId) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    jumpTo(target, () =>
      flushSync(() => {
        setInstant(true);
        setOpen(false);
      }),
    );
  };

  /* On a computer the email leads to the contact block, where the visitor
     picks Gmail, Outlook or a mail app; on a phone mailto just works */
  const writeTo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia(FINE_POINTER).matches) go("contact")(e);
  };

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (open) setOpen(false);
    scrollToTarget(0);
  };

  return (
    <>
      <motion.div className={styles.progress} style={{ transform: progress }} aria-hidden />

      <header className={styles.bar} data-hidden={(hidden && !open) || undefined}>
        {onHome ? (
          <a href="#top" className={styles.mark} onClick={toTop} aria-label={t.nav.home}>
            <TextRoll text="GCM" />
          </a>
        ) : (
          <Link href={home} className={styles.mark} aria-label={t.nav.homePage}>
            <TextRoll text="GCM" />
          </Link>
        )}

        <LocalTime label={t.nav.localTime} className={styles.time} />

        <div className={styles.actions}>
          <Availability variant="compact" className={styles.status} />
          <CvLink />
          <LangToggle />
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="site-index"
            onClick={toggle}
          >
            <span className={styles.menuLabel}>
              <TextRoll text={open ? t.nav.close : t.nav.menu} />
            </span>
            <span className={styles.burger} data-open={open || undefined} aria-hidden>
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <div
        ref={overlayRef}
        id="site-index"
        className={styles.overlay}
        data-open={open || undefined}
        data-instant={instant || undefined}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        inert={!open}
      >
        <nav className={styles.index} aria-label={t.nav.menu}>
          <ol className={styles.links}>
            {SECTIONS.map((id, i) => (
              <li key={id} className={styles.item}>
                {onHome || id === "contact" ? (
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={`#${id}`}
                    className={styles.link}
                    onClick={go(id)}
                  >
                    <span className={styles.linkInner}>
                      <TextRoll text={t.items[id]} />
                    </span>
                  </a>
                ) : (
                  <Link ref={i === 0 ? firstLinkRef : undefined} href={`${home}#${id}`} className={styles.link}>
                    <span className={styles.linkInner}>
                      <TextRoll text={t.items[id]} />
                    </span>
                  </Link>
                )}
              </li>
            ))}
            <li className={styles.item}>
              {onHome ? (
                <Link href={PAGE_PATH.services[locale]} className={styles.link}>
                  <span className={styles.linkInner}>
                    <TextRoll text={t.services.nav} />
                  </span>
                </Link>
              ) : (
                <a href="#top" className={styles.link} aria-current="page" onClick={toTop}>
                  <span className={styles.linkInner}>
                    <TextRoll text={t.services.nav} />
                  </span>
                </a>
              )}
            </li>
          </ol>
        </nav>

        <div className={styles.aside}>
          <Availability />
          <a href={mailto(t.mail)} className={styles.asideLink} onClick={writeTo}>{EMAIL}</a>
          <ul className={styles.profiles}>
            {PROFILE_LINKS.map((link) => (
              <li key={link.name}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.asideLink}>
                  <TextRoll text={link.name} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SiteNav;
