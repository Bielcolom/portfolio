"use client";
import { useEffect, useRef } from "react";

const TOKENS = [
  "const", "let", "=>", "if", "for", "null", "true", "false",
  "return", "async", "await", "type", "new", "void", "===",
  "!==", "||", "&&", "+=", "{}", "[]", "()", "fn", "0", "1",
  ";", ":", ".", "=",
];

const FONT_H = 14;

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

    let rafId = 0;
    let timerId = 0;
    let mobile = false;

    // Per-device settings — computed on init/resize
    let colW = 20;
    let trail = 18;
    let fps = 18;

    type Col = { drop: number; stream: string[] };
    let cols: Col[] = [];

    const applyMask = () => {
      const mask = mobile
        ? "none"
        : "linear-gradient(to right, black 0%, black 20%, transparent 30%, transparent 70%, black 80%, black 100%)";
      canvas.style.maskImage = mask;
      (canvas.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = mask;
    };

    const init = () => {
      mobile = window.innerWidth <= 768;
      // Mobile: fewer columns + shorter trail to keep GPU load low
      colW = mobile ? 30 : 20;
      trail = mobile ? 10 : 18;
      fps = mobile ? 20 : 18;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const numCols = Math.ceil(canvas.width / colW);
      const rows = Math.ceil(canvas.height / FONT_H);
      cols = Array.from({ length: numCols }, () => ({
        drop: Math.random() * -(rows * 1.5),
        stream: makeStream(rows).slice(0, rows),
      }));

      applyMask();
    };

    const draw = () => {
      ctx.fillStyle = "#0d0d0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_H - 1}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        const headR = Math.floor(col.drop);
        const px = i * colW + 2;
        const sLen = col.stream.length;

        for (let t = 0; t < trail; t++) {
          const row = headR - t;
          if (row < 0) continue;
          const py = row * FONT_H;
          if (py > canvas.height) continue;

          const ch = col.stream[((row % sLen) + sLen) % sLen];
          if (ch === " ") continue;

          const alpha = Math.max(0, (1 - t / trail) * 0.28);
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
      }, 1000 / fps);
    };

    init();

    if (mobile) {
      // On real mobile devices the canvas animation tanks CPU and kills video autoplay.
      // The dark body background already covers the page — no animation needed.
      return;
    }

    schedule();

    const onResize = () => { init(); };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(rafId);
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
