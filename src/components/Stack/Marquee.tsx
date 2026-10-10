"use client";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";
import styles from "./stack.module.scss";

/** Keeps x inside one copy's width, so the two copies loop seamlessly */
const wrap = (x: number) => ((((x + 50) % 50) + 50) % 50) - 50;

/**
 * A line of names that drifts on its own and runs faster, and leans, with
 * the speed of the scroll. Scrolling up turns it around. Decorative: the
 * same names are listed in plain text below it.
 */
const Marquee = ({ items, reverse = false, outline = false }: {
  items: string[];
  reverse?: boolean;
  outline?: boolean;
}) => {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const direction = useRef(reverse ? -1 : 1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const v = velocity.get();
    if (v < -40) direction.current = reverse ? 1 : -1;
    else if (v > 40) direction.current = reverse ? -1 : 1;
    const boost = 1 + Math.min(6, Math.abs(v) / 300);
    x.set(x.get() - direction.current * 1.6 * boost * (delta / 1000));
  });

  const transform = useTransform([x, velocity], ([px, v]: number[]) => {
    const lean = Math.max(-7, Math.min(7, -v / 260));
    return `translate3d(${wrap(px)}%, 0, 0) skewX(${reduce ? 0 : lean}deg)`;
  });

  return (
    <div className={styles.marquee} data-outline={outline || undefined} aria-hidden>
      <motion.div className={styles.track} style={{ transform }}>
        {[0, 1].map((copy) => (
          <span key={copy} className={styles.copy}>
            {items.map((item) => (
              <span key={item} className={styles.item}>
                {item}
                <svg viewBox="0 0 24 24" className={styles.star}>
                  <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
                </svg>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
