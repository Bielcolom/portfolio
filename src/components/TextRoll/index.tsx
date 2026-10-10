import styles from "./textRoll.module.scss";

/**
 * A label whose letters roll up to a second copy when the link or button
 * around it is hovered. Assistive tech reads the plain text once.
 */
const TextRoll = ({ text, className }: { text: string; className?: string }) => (
  <span className={className ? `${styles.roll} ${className}` : styles.roll}>
    <span className={styles.srOnly}>{text}</span>
    <span className={styles.track} aria-hidden>
      {[...text].map((ch, i) => {
        const glyph = ch === " " ? " " : ch;
        return (
          <span key={i} className={styles.char}>
            <span className={styles.face}>{glyph}</span>
            <span className={styles.face}>{glyph}</span>
          </span>
        );
      })}
    </span>
  </span>
);

export default TextRoll;
