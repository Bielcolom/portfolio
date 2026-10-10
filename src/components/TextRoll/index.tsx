import styles from "./textRoll.module.scss";

/**
 * A label whose letters roll up to a second copy when the link or button
 * around it is hovered. Assistive tech reads the plain text once, and so do
 * crawlers: both copies of each letter are drawn by CSS from data-glyph.
 */
const TextRoll = ({ text, className }: { text: string; className?: string }) => (
  <span className={className ? `${styles.roll} ${className}` : styles.roll}>
    <span className={styles.srOnly}>{text}</span>
    <span className={styles.track} aria-hidden>
      {[...text].map((ch, i) => (
        <span key={i} className={styles.char} data-glyph={ch === " " ? " " : ch} />
      ))}
    </span>
  </span>
);

export default TextRoll;
