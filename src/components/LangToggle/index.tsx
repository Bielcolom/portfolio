"use client";
import { flushSync } from "react-dom";
import { useLanguage } from "@/i18n/context";
import { Locale } from "@/i18n/translations";
import styles from "./langToggle.module.scss";

const LOCALES: Locale[] = ["en", "es"];

/**
 * The other language grows out of the toggle as a circle over the whole page.
 * Without view transitions, or under reduced motion, the strings swap in place.
 */
const LangToggle = () => {
  const { locale, setLocale, t } = useLanguage();
  const next = locale === "en" ? "es" : "en";

  const switchLocale = (e: React.MouseEvent<HTMLButtonElement>) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof document.startViewTransition !== "function") {
      setLocale(next);
      return;
    }

    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => {
      flushSync(() => setLocale(next));
    });
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 850,
          easing: "cubic-bezier(0.77, 0, 0.175, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }, () => {});
  };

  return (
    <button type="button" onClick={switchLocale} className={styles.btn}>
      {LOCALES.map((code) => (
        <span key={code} className={styles.code} data-active={code === locale || undefined}>
          {code.toUpperCase()}
        </span>
      ))}
      {/* Appended, not an aria-label: the accessible name keeps the visible
          "EN ES", so voice control users can say what they see */}
      <span className={styles.srOnly} lang={next}>{t.langToggle}</span>
    </button>
  );
};

export default LangToggle;
