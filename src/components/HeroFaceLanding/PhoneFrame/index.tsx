"use client";
import { ReactNode, useState, useEffect } from "react";
import styles from "./phoneFrame.module.scss";

interface Props {
  children?: ReactNode;
  accent: string;
  glowIntensity: number;
}

function useTime() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  });
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`);
    };
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const PhoneFrame = ({ children, accent, glowIntensity }: Props) => {
  const time = useTime();
  const glow = 18 + glowIntensity * 28;
  const glowOpacity = 10 + glowIntensity * 12;

  return (
    <div
      className={styles.root}
      style={{
        boxShadow: `0 28px 56px rgba(0,0,0,0.72), 0 0 ${glow}px color-mix(in oklch, ${accent} ${glowOpacity}%, transparent)`,
      }}
    >
      {/* ── Layer 1: dark screen background ─────────────────────────────── */}
      <svg viewBox="0 0 390 844" className={styles.svg} aria-hidden>
        <rect x="0" y="0" width="390" height="844" rx="50" fill="#0a0a0c" />
      </svg>

      {/* ── Layer 2: screen content ──────────────────────────────────────── */}
      {children}

      {/* ── Layer 3: phone bezel on top + status bar overlay ────────────── */}
      {/*    The bezel mask cuts the screen glass hole so content shows through */}
      <svg
        viewBox="0 0 390 844"
        className={styles.svgOverlay}
        aria-hidden
      >
        <defs>
          <linearGradient id="hflPhBody" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#323236" />
            <stop offset="20%"  stopColor="#242428" />
            <stop offset="100%" stopColor="#0f0f12" />
          </linearGradient>
          <linearGradient id="hflPhSide" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.09)" />
            <stop offset="28%"  stopColor="rgba(255,255,255,0)" />
            <stop offset="72%"  stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
          </linearGradient>
          <linearGradient id="hflPhHL" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor={accent} stopOpacity="0.14" />
            <stop offset="40%"  stopColor={accent} stopOpacity="0" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.05" />
          </linearGradient>

          {/* Bezel mask: phone body shape minus screen glass hole */}
          <mask id="hflBezel">
            <rect width="390" height="844" rx="50" fill="white" />
            <rect x="5" y="5" width="380" height="834" rx="46" fill="black" />
          </mask>
        </defs>

        {/* Phone bezel — body fills masked to the bezel ring only */}
        <rect x="0" y="0" width="390" height="844" rx="50" fill="url(#hflPhBody)" mask="url(#hflBezel)" />
        <rect x="0" y="0" width="390" height="844" rx="50" fill="url(#hflPhSide)" mask="url(#hflBezel)" />
        <rect x="0" y="0" width="390" height="844" rx="50" fill="url(#hflPhHL)"  mask="url(#hflBezel)" />

        {/* Phone outline strokes */}
        <rect x="-0.5" y="-0.5" width="391" height="845" rx="50.5" fill="none"
          stroke="rgba(0,0,0,0.55)" strokeWidth="1" />
        <rect x="0.75" y="0.75" width="388.5" height="842.5" rx="49.25" fill="none"
          stroke="#3e3e44" strokeWidth="1.5" />

        {/* Screen glass inner glow stroke */}
        <rect x="5.5" y="5.5" width="379" height="833" rx="45.5" fill="none"
          stroke={accent} strokeWidth="0.5" opacity={0.05 + glowIntensity * 0.06} />

        {/* Status bar — time */}
        <text
          x="30" y="36"
          fill="white" fillOpacity="0.92"
          fontSize="15.5" fontWeight="600"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
          letterSpacing="-0.3"
        >
          {time}
        </text>

        {/* Status bar — signal bars */}
        <rect x="278" y="31" width="3.5" height="5"  rx="1" fill="white" fillOpacity="0.85" />
        <rect x="284" y="27" width="3.5" height="9"  rx="1" fill="white" fillOpacity="0.85" />
        <rect x="290" y="23" width="3.5" height="13" rx="1" fill="white" fillOpacity="0.85" />

        {/* Status bar — WiFi */}
        <g transform="translate(311, 27)" fill="none" stroke="white" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round">
          <path d="M -8.5,0 Q 0,-6.5 8.5,0" />
          <path d="M -6,3.8 Q 0,-0.5 6,3.8" />
          <path d="M -3.2,7.5 Q 0,5 3.2,7.5" />
          <circle cx="0" cy="10" r="1.5" fill="white" stroke="none" fillOpacity="0.85" />
        </g>

        {/* Status bar — battery */}
        <g transform="translate(334, 23)">
          <rect x="0" y="0" width="24" height="13" rx="3" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="1.2" />
          <rect x="24.6" y="4" width="2.4" height="5" rx="1.2" fill="white" fillOpacity="0.5" />
          <rect x="2" y="2" width="18" height="9" rx="1.8" fill="white" fillOpacity="0.85" />
        </g>

        {/* Dynamic island */}
        <rect x="131" y="12" width="128" height="36" rx="18" fill="#000" />
        <circle cx="242" cy="30" r="7"   fill="#0c0c10" />
        <circle cx="242" cy="30" r="4.5" fill="#080810" />
        <circle cx="240" cy="28" r="1.5" fill="rgba(255,255,255,0.2)" />

        {/* Home indicator */}
        <rect x="148" y="816" width="94" height="5" rx="2.5"
          fill="rgba(255,255,255,0.28)" />
      </svg>
    </div>
  );
};

export default PhoneFrame;
