"use client";
import { motion, useMotionTemplate, useReducedMotion, useSpring } from "framer-motion";
import { useRef } from "react";
import styles from "./magnetic.module.scss";

const SPRING = { stiffness: 260, damping: 20, mass: 0.5 };

/**
 * Pulls its child toward a mouse pointer that is over it, and springs back
 * on leave. A wrapper, so the child keeps its own press transform.
 */
const Magnetic = ({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`;

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={styles.magnetic}
      style={{ transform }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.span>
  );
};

export default Magnetic;
