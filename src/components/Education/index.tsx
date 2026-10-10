"use client";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/Reveal";
import { useLanguage } from "@/i18n/context";
import { EducationEntry } from "@/i18n/translations";
import styles from "./education.module.scss";

const Entry = ({ entry }: { entry: EducationEntry }) => {
  const ref = useRef<HTMLLIElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <li ref={ref} className={styles.entry} data-visible={visible || undefined}>
      <span className={styles.node} aria-hidden />
      <p className={styles.period}>{entry.period}</p>
      <div className={styles.info}>
        <h3 className={styles.entryTitle}>{entry.title}</h3>
        <p className={styles.school}>{entry.school}</p>
        {entry.note && <p className={styles.note}>{entry.note}</p>}
      </div>
    </li>
  );
};

/** A timeline whose line draws itself down the entries as they are read */
const Education = () => {
  const { t } = useLanguage();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.8", "end 0.55"] });
  const draw = useTransform(scrollYProgress, (p) => `scaleY(${p})`);

  return (
    <section id="education" className={styles.education} aria-labelledby="education-title">
      <Reveal as="h2" id="education-title" text={t.education.title} className={styles.title} />

      <div className={styles.timeline}>
        <span className={styles.track} aria-hidden>
          <motion.span className={styles.fill} style={{ transform: draw }} />
        </span>
        <ol ref={listRef} className={styles.entries}>
          {t.education.entries.map((entry) => (
            <Entry key={entry.title} entry={entry} />
          ))}
        </ol>
      </div>

      <div className={styles.extras}>
        <div className={styles.extra}>
          <h3 className={styles.extraTitle}>{t.education.awardTitle}</h3>
          <p className={styles.extraText}>{t.education.award}</p>
        </div>
        <div className={styles.extra}>
          <h3 className={styles.extraTitle}>{t.education.trainingTitle}</h3>
          <ul className={styles.training}>
            {t.education.training.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Education;
