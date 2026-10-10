"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./panel.module.scss";

/**
 * A raised sheet that slides over the story and opens to full bleed as it
 * reaches the top: the page turning from the particles to the record.
 */
const Panel = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const clipPath = useTransform(scrollYProgress, (p) => {
    const rest = 1 - p;
    const radius = rest * 40;
    return `inset(${rest * 10}svh ${rest * 6}vw 0px ${rest * 6}vw round ${radius}px ${radius}px 0px 0px)`;
  });

  return (
    <motion.div
      ref={ref}
      className={styles.panel}
      style={{ clipPath: reduce ? undefined : clipPath }}
      data-particles="exit"
    >
      {children}
    </motion.div>
  );
};

export default Panel;
