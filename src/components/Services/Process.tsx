"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/Reveal";
import { useLanguage } from "@/i18n/context";
import styles from "./process.module.scss";

/** Four steps on one line that draws through them when they arrive: across on
    wide screens, down on phones. The numbers carry the order */
const Process = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <section id="process" className={styles.process} aria-labelledby="process-title">
      <Reveal as="h2" id="process-title" text={t.services.processTitle} className={styles.title} />
      <div ref={ref} className={styles.track} data-visible={visible || undefined}>
        <span className={styles.line} aria-hidden />
        <ol className={styles.steps}>
          {t.services.steps.map((step, i) => (
            <li key={i} className={styles.step}>
              <span className={styles.node} aria-hidden />
              <span className={styles.index} aria-hidden>{i + 1}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Process;
