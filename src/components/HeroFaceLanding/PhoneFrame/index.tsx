"use client";
import { ReactNode } from "react";
import styles from "./phoneFrame.module.scss";

interface Props {
  children?: ReactNode;
  accent: string;
  glowIntensity: number;
}

const PhoneFrame = ({ children, accent, glowIntensity }: Props) => (
  <div className={styles.root}>
    <svg
      viewBox="0 0 390 844"
      className={styles.svg}
      style={{
        filter: `drop-shadow(0 24px 48px rgba(0,0,0,0.75))
                 drop-shadow(0 0 ${14 + glowIntensity * 22}px color-mix(in oklch, ${accent} ${8 + glowIntensity * 10}%, transparent))`,
      }}
    >
      <defs>
        {/* Titanium body */}
        <linearGradient id="hflPhBody" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2e2e32" />
          <stop offset="45%" stopColor="#1c1c20" />
          <stop offset="100%" stopColor="#111114" />
        </linearGradient>
        {/* Accent rim glow */}
        <linearGradient id="hflPhHL" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.12" />
          <stop offset="35%" stopColor={accent} stopOpacity="0" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.04" />
        </linearGradient>
        {/* Side-button raised look */}
        <linearGradient id="hflPhBtnL" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#383840" />
          <stop offset="100%" stopColor="#22222a" />
        </linearGradient>
        <linearGradient id="hflPhBtnR" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#22222a" />
          <stop offset="100%" stopColor="#383840" />
        </linearGradient>
      </defs>

      {/* ── Phone body (titanium frame) ─────────────────────────── */}
      <rect x="0" y="0" width="390" height="844" rx="50" fill="url(#hflPhBody)" />
      <rect x="0" y="0" width="390" height="844" rx="50" fill="url(#hflPhHL)" />
      {/* Outer edge shadow */}
      <rect x="-0.5" y="-0.5" width="391" height="845" rx="50.5" fill="none"
        stroke="rgba(0,0,0,0.6)" strokeWidth="1" />
      {/* Titanium rim highlight */}
      <rect x="0.75" y="0.75" width="388.5" height="842.5" rx="49.25" fill="none"
        stroke="#3e3e44" strokeWidth="1.5" />

      {/* ── Screen glass (nearly full-bleed, iPhone-style) ─────── */}
      <rect x="3" y="3" width="384" height="838" rx="47" fill="#080808" />
      {/* Glass inner edge glow */}
      <rect x="3.5" y="3.5" width="383" height="837" rx="46.5" fill="none"
        stroke={accent} strokeWidth="0.6" opacity={0.06 + glowIntensity * 0.07} />
      {/* Glass subtle specular at top */}
      <rect x="3" y="3" width="384" height="120" rx="47" fill="rgba(255,255,255,0.015)" />

      {/* ── Dynamic island ─────────────────────────────────────── */}
      <rect x="131" y="55" width="128" height="36" rx="18" fill="#000" />
      {/* Camera lens inside island */}
      <circle cx="242" cy="73" r="7" fill="#0c0c10" />
      <circle cx="242" cy="73" r="4.5" fill="#080810" />
      <circle cx="240" cy="71" r="1.5" fill="rgba(255,255,255,0.18)" />

      {/* ── Left-side buttons ──────────────────────────────────── */}
      {/* Action button (iPhone 15+, top-left, shorter oval) */}
      <rect x="-2" y="142" width="5" height="38" rx="2.5"
        fill="url(#hflPhBtnL)" stroke="#111116" strokeWidth="0.5" />
      {/* Volume + */}
      <rect x="-2" y="198" width="5" height="64" rx="2.5"
        fill="url(#hflPhBtnL)" stroke="#111116" strokeWidth="0.5" />
      {/* Volume − */}
      <rect x="-2" y="276" width="5" height="64" rx="2.5"
        fill="url(#hflPhBtnL)" stroke="#111116" strokeWidth="0.5" />

      {/* ── Right-side button (power / sleep) ──────────────────── */}
      <rect x="387" y="240" width="5" height="94" rx="2.5"
        fill="url(#hflPhBtnR)" stroke="#111116" strokeWidth="0.5" />

      {/* ── Home indicator in the bottom bezel ─────────────────── */}
      <rect x="148" y="815" width="94" height="5" rx="2.5"
        fill="rgba(255,255,255,0.26)" />
    </svg>
    {children}
  </div>
);

export default PhoneFrame;
