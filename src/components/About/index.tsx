"use client";
import { MotionValue, motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/i18n/context";
import styles from "./about.module.scss";

const Word = ({ text, progress, from, to }: {
  text: string;
  progress: MotionValue<number>;
  from: number;
  to: number;
}) => {
  const opacity = useTransform(progress, [from, to], [0.16, 1]);
  return <motion.span className={styles.word} style={{ opacity }}>{text}</motion.span>;
};

/**
 * The statement lights up word by word as it is read down the page, over the
 * cloud the portrait has just turned into. Facts a recruiter screens for sit
 * underneath, as plain text.
 */
const About = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = t.about.statement.split(" ");

  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <h2 id="about-title" className={styles.srOnly}>{t.about.title}</h2>

      <p ref={ref} className={styles.statement}>
        {words.map((word, i) => (
          <span key={`${i}-${word}`}>
            <Word text={word} progress={scrollYProgress} from={i / words.length} to={(i + 1) / words.length} />
            {i < words.length - 1 && " "}
          </span>
        ))}
      </p>

      <dl className={styles.facts}>
        {t.about.facts.map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt className={styles.label}>{fact.label}</dt>
            <dd className={styles.value}>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default About;
