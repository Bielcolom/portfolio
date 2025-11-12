import React from "react";
import { motion } from "framer-motion";
import styles from "./monitor.module.scss";

interface MonitorProps {
  children?: React.ReactNode;
  durationMs?: number; // duración total para sincronizar con la animación del video
  reducedMotion?: boolean | null; // respetar prefers-reduced-motion pasado desde arriba (puede ser null en framer-motion)
}

/** Monitor: solo bezel + pantalla + soporte. Envuelve children dentro de un slot absoluto sobre la pantalla. */
export default function Monitor({ children, durationMs = 1800, reducedMotion }: MonitorProps) {
  const commonTransition = {
    duration: durationMs / 1000,
    ease: [0.16, 0.84, 0.39, 1],
  } as const;

  return (
    <motion.div
      className={styles.monitorRoot}
      data-anim="enter"
      initial={reducedMotion ? false : { z: -220, scale: 0.92, opacity: 0.9 }}
      animate={reducedMotion ? {} : { z: 0, scale: 1, opacity: 1 }}
      transition={commonTransition}
    >
      <svg viewBox="0 0 1200 760" className={styles.monitorSvg} aria-hidden>
        <defs>
          <linearGradient id="bezelFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0f1012" />
            <stop offset="100%" stopColor="#050607" />
          </linearGradient>
          <linearGradient id="bezelStrokeGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#2ddcff" />
            <stop offset="50%" stopColor="#835bff" />
            <stop offset="100%" stopColor="#ff5fb1" />
          </linearGradient>
          <radialGradient id="screenGlow" cx="50%" cy="8%" r="75%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.0)" />
          </radialGradient>
          <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite operator="out" in="SourceGraphic" in2="blur" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feBlend in="SourceGraphic" mode="normal" />
          </filter>
          <linearGradient id="standNeck" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#20252b" />
            <stop offset="60%" stopColor="#14171a" />
            <stop offset="100%" stopColor="#0c0e10" />
          </linearGradient>
          <linearGradient id="standEdge" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#2ddcff" />
            <stop offset="50%" stopColor="#835bff" />
            <stop offset="100%" stopColor="#ff5fb1" />
          </linearGradient>
          <radialGradient id="standBase" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#181b20" />
            <stop offset="70%" stopColor="#101214" />
            <stop offset="100%" stopColor="#0a0c0e" />
          </radialGradient>
          <filter id="standShadowFilter" x="-40%" y="-40%" width="180%" height="220%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="shadow" />
            <feOffset dx="0" dy="6" result="shadowOffset" />
            <feMerge>
              <feMergeNode in="shadowOffset" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="60" y="40" width="1080" height="660" rx="22" fill="url(#bezelFill)" filter="url(#innerShadow)" />
        <rect x="90" y="70" width="1020" height="600" rx="12" fill="#030405" />
        <rect x="90" y="70" width="1020" height="600" rx="12" fill="url(#screenGlow)" />
        <rect x="60" y="40" width="1080" height="660" rx="22" className={styles.bezelGlow} />
        <g className={styles.standGroup}>
          {/* Cuello del monitor (trapezoidal ampliado) */}
          <path
            d="M565 698 L635 698 L665 736 L535 736 Z"
            fill="url(#standNeck)"
            stroke="url(#standEdge)"
            strokeWidth="2.4"
          />
          {/* Base curva más amplia y profunda */}
          <path
            d="M460 736 Q600 762 740 736 L740 766 Q600 786 460 766 Z"
            fill="url(#standBase)"
            stroke="url(#standEdge)"
            strokeWidth="2.6"
            filter="url(#standShadowFilter)"
          />
          {/* Sombra suave ajustada al nuevo tamaño */}
          <ellipse cx="600" cy="770" rx="230" ry="18" fill="rgba(0,0,0,0.55)" />
        </g>
      </svg>
      {children}
    </motion.div>
  );
}
