"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import styles from "./codeRain.module.scss";

function subscribeResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
const getIsMobile = () => window.innerWidth <= 768;
const getServerSnapshot = () => false;

const TOKENS = [
  "const", "let", "=>", "if", "for", "null", "true", "false",
  "return", "async", "await", "type", "new", "void", "===",
  "!==", "||", "&&", "+=", "{}", "[]", "()", "fn", "0", "1",
  ";", ":", ".", "=",
];

// ── Desktop canvas constants ────────────────────────────────────────────────
const FONT_H = 14;
const COL_W = 20;
const TRAIL = 18;
const FPS = 18;

function makeStream(rows: number): string[] {
  const out: string[] = [];
  while (out.length < rows * 2) {
    const tok = TOKENS[Math.floor(Math.random() * TOKENS.length)];
    for (const ch of tok) out.push(ch);
    out.push(" ", " ");
  }
  return out;
}

// ── Mobile CSS columns ──────────────────────────────────────────────────────
// Deterministic (index-based) so server and client produce identical markup.

// Two interleaved waves, offset by half the duration, so one is always visible
// while the other resets — creating a continuous "one after another" cascade.
// Tiny per-column delay stagger (0.1s) prevents a simultaneous reset flash.
const COLS_PER_WAVE = 7;
const WAVE_DURATION = 9;
const COL_SPACING = 90 / COLS_PER_WAVE; // ~12.9% between wave A columns

const mobileColumns = [
  // Wave A
  ...Array.from({ length: COLS_PER_WAVE }, (_, i) => ({
    left: `${(i / COLS_PER_WAVE) * 90 + 3}%`,
    duration: `${WAVE_DURATION}s`,
    delay: `${-(i * 0.12).toFixed(2)}s`,
    content: Array.from({ length: 50 }, (_, j) =>
      TOKENS[(i * 7 + j * 3) % TOKENS.length]
    ).join("\n"),
  })),
  // Wave B — half-duration offset, positions midpoint between wave A columns
  ...Array.from({ length: COLS_PER_WAVE }, (_, i) => ({
    left: `${(i / COLS_PER_WAVE) * 90 + 3 + COL_SPACING / 2}%`,
    duration: `${WAVE_DURATION}s`,
    delay: `${-(WAVE_DURATION / 2 + i * 0.12).toFixed(2)}s`,
    content: Array.from({ length: 50 }, (_, j) =>
      TOKENS[((i + 4) * 5 + j * 4) % TOKENS.length]
    ).join("\n"),
  })),
];

// ── Component ───────────────────────────────────────────────────────────────
export default function CodeRain() {
  const isMobile = useSyncExternalStore(subscribeResize, getIsMobile, getServerSnapshot);
  const ref = useRef<HTMLCanvasElement>(null);

  // Desktop-only canvas animation
  useEffect(() => {
    if (isMobile) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let timerId = 0;

    type Col = { drop: number; stream: string[] };
    let cols: Col[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const numCols = Math.ceil(canvas.width / COL_W);
      const rows = Math.ceil(canvas.height / FONT_H);
      cols = Array.from({ length: numCols }, () => ({
        drop: Math.random() * -(rows * 1.5),
        stream: makeStream(rows).slice(0, rows),
      }));
    };

    const draw = () => {
      ctx.fillStyle = "#0d0d0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_H - 1}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        const headR = Math.floor(col.drop);
        const px = i * COL_W + 2;
        const sLen = col.stream.length;

        for (let t = 0; t < TRAIL; t++) {
          const row = headR - t;
          if (row < 0) continue;
          const py = row * FONT_H;
          if (py > canvas.height) continue;
          const ch = col.stream[((row % sLen) + sLen) % sLen];
          if (ch === " ") continue;
          const alpha = Math.max(0, (1 - t / TRAIL) * 0.28);
          ctx.fillStyle = `rgba(61,220,255,${alpha})`;
          ctx.fillText(ch, px, py);
        }

        col.drop += 1;
        if (headR * FONT_H > canvas.height && Math.random() > 0.975) {
          col.drop = Math.random() * -30;
          col.stream = makeStream(Math.ceil(canvas.height / FONT_H));
        }
      }
    };

    // setTimeout + single rAF per frame: fires exactly FPS times/sec,
    // no wasted rAF callbacks between frames (crucial on slow mobile CPUs)
    const schedule = () => {
      timerId = window.setTimeout(() => {
        rafId = requestAnimationFrame(() => {
          draw();
          schedule();
        });
      }, 1000 / FPS);
    };

    init();
    schedule();

    const onResize = () => { init(); };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className={styles.mobileContainer}>
        {mobileColumns.map((col, i) => (
          <span
            key={i}
            className={styles.col}
            style={{
              "--col-left": col.left,
              "--col-duration": col.duration,
              "--col-delay": col.delay,
            } as React.CSSProperties}
          >
            {col.content}
          </span>
        ))}
      </div>
    );
  }

  return <canvas ref={ref} className={styles.desktopCanvas} />;
}
