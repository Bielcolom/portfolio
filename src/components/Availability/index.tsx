"use client";
import { useLanguage } from "@/i18n/context";
import styles from "./availability.module.scss";

interface Props {
  /** "compact" is the status line alone, for the header; "projects" speaks to clients */
  variant?: "full" | "compact" | "projects";
  className?: string;
}

/** "Open to new roles": the green light reads as clocked in, ready to start */
const Availability = ({ variant = "full", className }: Props) => {
  const { t } = useLanguage();
  const classes = [styles.root, className].filter(Boolean).join(" ");
  const lines = variant === "projects" ? t.services.availability : t.availability;

  return (
    <div className={classes} data-variant={variant}>
      <span className={styles.light} aria-hidden />
      <div className={styles.text}>
        <p className={styles.status}>
          {variant === "compact" ? t.availability.short : lines.status}
        </p>
        {variant !== "compact" && (
          <>
            <p className={styles.where}>{lines.where}</p>
            <p className={styles.detail}>{lines.detail}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Availability;
