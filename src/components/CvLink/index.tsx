"use client";
import { useLanguage } from "@/i18n/context";
import styles from "./cvLink.module.scss";

const CvLink = () => {
  const { locale, t } = useLanguage();

  return (
    <a
      href={t.cv.href}
      hrefLang={locale}
      type="application/pdf"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
      aria-label={t.cv.open}
    >
      {t.cv.label}
    </a>
  );
};

export default CvLink;
