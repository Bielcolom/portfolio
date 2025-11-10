import React from "react";
import styles from "./monitor.module.scss";

interface MonitorProps {
  children?: React.ReactNode;
}

/** Monitor: solo bezel + pantalla + soporte. Envuelve children dentro de un slot absoluto sobre la pantalla. */
export default function Monitor({ children }: MonitorProps) {
  return (
    <div className={styles.monitorRoot}>
      <svg viewBox="0 0 1200 760" className={styles.monitorSvg} aria-hidden>
        <defs>
          <linearGradient id="bezelFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#181a1f" />
            <stop offset="100%" stopColor="#0d0f12" />
          </linearGradient>
          <linearGradient id="bezelStrokeGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#2ddcff" />
            <stop offset="50%" stopColor="#835bff" />
            <stop offset="100%" stopColor="#ff5fb1" />
          </linearGradient>
          <radialGradient id="screenGlow" cx="50%" cy="8%" r="75%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.0)" />
          </radialGradient>
          <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite operator="out" in="SourceGraphic" in2="blur" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feBlend in="SourceGraphic" mode="normal" />
          </filter>
        </defs>
        <rect x="60" y="40" width="1080" height="660" rx="22" fill="url(#bezelFill)" filter="url(#innerShadow)" />
        <rect x="90" y="70" width="1020" height="600" rx="12" fill="#0b0d10" />
        <rect x="90" y="70" width="1020" height="600" rx="12" fill="url(#screenGlow)" />
        <rect x="60" y="40" width="1080" height="660" rx="22" className={styles.bezelGlow} />
        <g className={styles.standShadow}>
          <rect x="550" y="700" width="100" height="40" rx="8" fill="#101317" />
          <rect x="480" y="740" width="240" height="24" rx="12" fill="#0d1013" />
        </g>
      </svg>
      {children}
    </div>
  );
}
