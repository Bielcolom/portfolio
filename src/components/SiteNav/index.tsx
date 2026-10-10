"use client";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Availability from "@/components/Availability";
import CvLink from "@/components/CvLink";
import LangToggle from "@/components/LangToggle";
import LocalTime from "@/components/LocalTime";
import { lockScroll, scrollToTarget } from "@/components/SmoothScroll";
import TextRoll from "@/components/TextRoll";
import { EMAIL, PROFILE_LINKS } from "@/content/links";
import { SECTIONS } from "@/content/sections";
import { useLanguage } from "@/i18n/context";
import { SectionId } from "@/i18n/translations";
import styles from "./siteNav.module.scss";

const EASE = "cubic-bezier(0.77, 0, 0.175, 1)";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The fixed bar and the full-screen index it opens. The index grows out of
 * the menu button as a circle; choosing an entry swaps the page underneath
 * and wipes the destination up over it, like changing pages.
 */
const SiteNav = () => {
  const { t } = useLanguage();
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

    const swap = () => {
      flushSync(() => {
        setInstant(true);
        setOpen(false);
      });
      scrollToTarget(target, true);
    };

    if (reducedMotion() || typeof document.startViewTransition !== "function") {
      swap();
      return;
    }

    const transition = document.startViewTransition(swap);
    transition.ready.then(() => {
      const root = document.documentElement;
      root.animate(
        { clipPath: ["inset(100% 0 0 0)", "inset(0 0 0 0)"] },
        { duration: 900, easing: EASE, pseudoElement: "::view-transition-new(root)" },
      );
      root.animate(
        { transform: ["none", "translate3d(0, -8%, 0)"], opacity: [1, 0.3] },
        { duration: 900, easing: EASE, pseudoElement: "::view-transition-old(root)" },
      );
    }, () => {});
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
        <a href="#top" className={styles.mark} onClick={toTop} aria-label={t.nav.home}>
          <TextRoll text="GCM" />
        </a>

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
            <TextRoll text={open ? t.nav.close : t.nav.menu} />
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
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        inert={!open}
      >
        <nav className={styles.index} aria-label={t.nav.menu}>
          <ol className={styles.links}>
            {SECTIONS.map((id, i) => (
              <li key={id} className={styles.item}>
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
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.aside}>
          <Availability />
          <a href={`mailto:${EMAIL}`} className={styles.asideLink}>{EMAIL}</a>
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
