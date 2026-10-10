"use client";
import { useLanguage } from "@/i18n/context";
import styles from "./availability.module.scss";

interface Props {
  /** "compact" is the status line alone, for the header */
  variant?: "full" | "compact";
  className?: string;
}

/** "Open to new roles": the green light reads as clocked in, ready to start */
const Availability = ({ variant = "full", className }: Props) => {
  const { t } = useLanguage();
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div className={classes} data-variant={variant}>
      <span className={styles.light} aria-hidden />
      <div className={styles.text}>
        <p className={styles.status}>
          {variant === "compact" ? t.availability.short : t.availability.status}
        </p>
        {variant === "full" && (
          <>
            <p className={styles.where}>{t.availability.where}</p>
            <p className={styles.detail}>{t.availability.detail}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Availability;
