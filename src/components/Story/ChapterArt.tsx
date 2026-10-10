import styles from "./story.module.scss";

/**
 * The four chapter objects as line drawings, for browsers without WebGL 2.
 * Hidden whenever the particles are running.
 */
const ChapterArt = ({ active }: { active: number }) => (
  <div className={styles.art}>
    <svg viewBox="-120 -120 240 240" className={styles.artItem} data-active={active === 0 || undefined}>
      {[-62, 0, 62].map((y) => (
        <path key={y} d={`M-96 ${y}l58-30h134l-58 30z`} transform={`translate(-19 ${y * 0.1})`} />
      ))}
      <line x1="-30" y1="-48" x2="-30" y2="56" className={styles.artFaint} />
      <line x1="30" y1="-48" x2="30" y2="56" className={styles.artFaint} />
    </svg>

    <svg viewBox="-120 -120 240 240" className={styles.artItem} data-active={active === 1 || undefined}>
      <path d="M-62 -48h124a28 28 0 0 1 28 28v52a28 28 0 0 1-28 28H-30l-34 28v-28h2a28 28 0 0 1-28-28v-52a28 28 0 0 1 28-28z" />
      {[-30, 0, 30].map((x) => (
        <circle key={x} cx={x} cy="6" r="7" className={styles.artFill} />
      ))}
      <path d="M86 -96c2 14 6 18 20 20-14 2-18 6-20 20-2-14-6-18-20-20 14-2 18-6 20-20z" className={styles.artFill} />
    </svg>

    <svg viewBox="-120 -120 240 240" className={styles.artItem} data-active={active === 2 || undefined}>
      <rect x="-36" y="-70" width="148" height="104" rx="8" />
      <line x1="-36" y1="-50" x2="112" y2="-50" className={styles.artFaint} />
      <rect x="-104" y="-40" width="62" height="124" rx="12" />
      <line x1="-82" y1="-32" x2="-64" y2="-32" className={styles.artBold} />
      <path d="M-50 -10C-30 -40 0 -40 20 -20" className={styles.artFaint} />
    </svg>

    <svg viewBox="-120 -120 240 240" className={styles.artItem} data-active={active === 3 || undefined}>
      <rect x="-104" y="-50" width="180" height="114" rx="12" />
      <rect x="-84" y="-30" width="30" height="24" rx="5" className={styles.artFill} />
      <line x1="-84" y1="22" x2="16" y2="22" className={styles.artBold} />
      <line x1="-84" y1="42" x2="-34" y2="42" className={styles.artFaint} />
      <rect x="66" y="-92" width="38" height="30" rx="5" className={styles.artFill} />
      <path d="M73 -92v-8a12 12 0 0 1 24 0v8" />
    </svg>
  </div>
);

export default ChapterArt;
