"use client";
import { useEffect, useRef } from "react";

const TOKENS = [
  "const", "let", "=>", "if", "for", "null", "true", "false",
  "return", "async", "await", "type", "new", "void", "===",
  "!==", "||", "&&", "+=", "{}", "[]", "()", "fn", "0", "1",
  ";", ":", ".", "=",
];

const COL_W = 20;
const FONT_H = 14;
const TRAIL = 18;

function makeStream(rows: number): string[] {
  const out: string[] = [];
  while (out.length < rows * 2) {
    const tok = TOKENS[Math.floor(Math.random() * TOKENS.length)];
    for (const ch of tok) out.push(ch);
    out.push(" ", " ");
  }
  return out;
}

export default function CodeRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = 0;
    let ms = 1000 / 18;

    const applyFps = () => {
      ms = 1000 / (window.innerWidth <= 768 ? 20 : 18);
    };

    type Col = { drop: number; stream: string[] };
    let cols: Col[] = [];

    const applyMask = () => {
      const mobile = window.innerWidth <= 768;
      const mask = mobile
        ? "none"
        : "linear-gradient(to right, black 0%, black 20%, transparent 30%, transparent 70%, black 80%, black 100%)";
      canvas.style.maskImage = mask;
      (canvas.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = mask;
    };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const numCols = Math.ceil(canvas.width / COL_W);
      const rows = Math.ceil(canvas.height / FONT_H);
      cols = Array.from({ length: numCols }, () => ({
        drop: Math.random() * -(rows * 1.5),
        // Fixed char per row — assigned once, never changes, eliminates sparkle
        stream: makeStream(rows).slice(0, rows),
      }));
      applyMask();
      applyFps();
    };

    init();
    const onResize = () => init();
    window.addEventListener("resize", onResize);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < ms) return;
      last = now;

      // Full clear — trail is drawn explicitly so no fade accumulation needed
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

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 1,
      }}
    />
  );
}
