"use client";
import { ReactNode } from "react";
import styles from "./monitor.module.scss";

interface Props {
  children?: ReactNode;
  accent: string;
  glowIntensity: number;
}

const Monitor = ({ children, accent, glowIntensity }: Props) => (
  <div className={styles.root}>
    <svg
      viewBox="0 0 1200 760"
      className={styles.svg}
      style={{
        filter: `drop-shadow(0 24px 50px rgba(0,0,0,0.65))
                 drop-shadow(0 0 ${20 + glowIntensity * 30}px color-mix(in oklch, ${accent} ${15 + glowIntensity * 15}%, transparent))`,
      }}
    >
      <defs>
        <linearGradient id="hflBezel" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1d1f24" />
          <stop offset="55%" stopColor="#141519" />
          <stop offset="100%" stopColor="#0a0b0d" />
        </linearGradient>
        <linearGradient id="hflBezelHL" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.16" />
          <stop offset="35%" stopColor={accent} stopOpacity="0" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.06" />
        </linearGradient>
      </defs>

      <rect x="50" y="40" width="1100" height="620" rx="8" fill="url(#hflBezel)" />
      <rect x="50" y="40" width="1100" height="620" rx="8" fill="url(#hflBezelHL)" />
      <rect x="50.5" y="40.5" width="1099" height="619" rx="7.5" fill="none"
        stroke={accent} strokeWidth="1" opacity={0.18 + glowIntensity * 0.12} />
      <rect x="49.5" y="39.5" width="1101" height="621" rx="8.5" fill="none"
        stroke="rgba(0,0,0,0.6)" strokeWidth="1" />

      <rect x="62" y="52" width="1076" height="596" rx="3" fill="#000" />
      <rect x="62.5" y="52.5" width="1075" height="595" rx="2.5" fill="none"
        stroke="rgba(0,0,0,0.9)" strokeWidth="1" />
      <rect x="63.5" y="53.5" width="1073" height="593" rx="2" fill="none"
        stroke={accent} strokeWidth="0.6" opacity={0.08 + glowIntensity * 0.08} />

      <circle cx="600" cy="654" r="2" fill={accent} opacity={0.55 + glowIntensity * 0.35} />

      <rect x="585" y="660" width="30" height="60" fill="#16181c" />
      <rect x="585" y="660" width="30" height="60" fill="none" stroke={accent} strokeWidth="0.5" opacity={0.12} />
      <rect x="450" y="718" width="300" height="6" rx="3" fill="#1c1f24" />
      <rect x="450" y="718" width="300" height="6" rx="3" fill="none" stroke={accent} strokeWidth="0.5" opacity={0.14} />
    </svg>
    {children}
  </div>
);

export default Monitor;
