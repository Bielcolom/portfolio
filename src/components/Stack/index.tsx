"use client";
import Reveal from "@/components/Reveal";
import { useLanguage } from "@/i18n/context";
import Marquee from "./Marquee";
import styles from "./stack.module.scss";

/**
 * What runs in production leads, at display size; what he has used on his
 * own runs the other way, outlined. The ledger underneath keeps the two
 * apart in plain text, as the CV does.
 */
const Stack = () => {
  const { t } = useLanguage();
  const [production, personal] = t.stack.groups;

  return (
    <section id="stack" className={styles.stack} aria-labelledby="stack-title">
      <Reveal as="h2" id="stack-title" text={t.stack.title} className={styles.title} />

      <div className={styles.marquees}>
        <Marquee items={production.items} />
        <Marquee items={personal.items} reverse outline />
      </div>

      <dl className={styles.ledger}>
        {t.stack.groups.map((group) => (
          <div key={group.name} className={styles.ledgerRow}>
            <dt className={styles.ledgerKey}>{group.name}</dt>
            <dd className={styles.ledgerValue}>{group.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default Stack;
