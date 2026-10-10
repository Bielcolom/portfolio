"use client";
import TextRoll from "@/components/TextRoll";
import { useLanguage } from "@/i18n/context";
import styles from "./cvLink.module.scss";

/** Opens the CV for the active language; the other locale's PDF is never offered */
const CvLink = () => {
  const { locale, t } = useLanguage();

  return (
    <a
      href={t.cv.href}
      hrefLang={locale}
      type="application/pdf"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.cv.open}
      className={styles.link}
    >
      <TextRoll text={t.cv.label} />
    </a>
  );
};

export default CvLink;
