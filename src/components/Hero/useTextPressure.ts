import { useEffect } from "react";

/** Resting axes, matching the CSS, so the first written frame changes nothing */
const REST = { wght: 700, wdth: 100 };
const PEAK = { wght: 900, wdth: 125 };

/**
 * Letters near the mouse swell on the variable font's weight and width
 * axes, and settle back as it moves away. All rects are read before any
 * style is written, so a frame costs one layout.
 */
export function useTextPressure(
  areaRef: React.RefObject<HTMLElement | null>,
  textRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const area = areaRef.current;
    const text = textRef.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!area || !text || !fine || reduce) return;

    const chars = Array.from(text.querySelectorAll<HTMLElement>("[data-char]"));
    const axes = chars.map(() => ({ ...REST }));
    let mx = 0;
    let my = 0;
    let inside = false;
    let raf = 0;

    const frame = () => {
      const radius = Math.max(window.innerWidth * 0.22, 220);
      const rects = chars.map((el) => el.getBoundingClientRect());
      let moving = false;

      rects.forEach((r, i) => {
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        const f = inside ? Math.max(0, 1 - d / radius) : 0;
        const k = f * f * (3 - 2 * f);
        const a = axes[i];
        const tw = REST.wght + (PEAK.wght - REST.wght) * k;
        const ts = REST.wdth + (PEAK.wdth - REST.wdth) * k;
        a.wght += (tw - a.wght) * 0.16;
        a.wdth += (ts - a.wdth) * 0.16;
        if (Math.abs(tw - a.wght) > 0.5 || Math.abs(ts - a.wdth) > 0.05) moving = true;
      });

      chars.forEach((el, i) => {
        el.style.fontVariationSettings = `"wght" ${axes[i].wght.toFixed(1)}, "wdth" ${axes[i].wdth.toFixed(2)}`;
      });

      raf = moving ? requestAnimationFrame(frame) : 0;
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      inside = true;
      wake();
    };

    const onLeave = () => {
      inside = false;
      wake();
    };

    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    };
  }, [areaRef, textRef]);
}
