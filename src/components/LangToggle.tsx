"use client";
import { useLanguage } from "@/i18n/context";
import styles from "./LangToggle.module.scss";

const LangToggle = () => {
  const { locale, setLocale } = useLanguage();
  const next = locale === "en" ? "es" : "en";

  return (
    <button type="button" onClick={() => setLocale(next)} className={styles.btn}>
      {locale.toUpperCase()}
    </button>
  );
};

export default LangToggle;
