"use client";
import { useEffect, useRef } from "react";
import styles from "./cursor.module.scss";

/** Hover states the ring knows; anything clickable without one reads as "link" */
type CursorState = "" | "link" | "lens" | "drag" | "label";

/**
 * A dot that sits exactly on the pointer and a ring that trails it. Over
 * controls the ring fills; over the name it becomes a lens that inverts the
 * letters; over the 3D stage it carries a label. Mouse only, never on touch
 * or under reduced motion, and the native cursor hides only once this works.
 */
const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!fine.matches || reduce.matches || !dot || !ring || !label) return;

    const root = document.documentElement;
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;
    let shown = false;
    let state: CursorState = "";

    const follow = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(follow) : 0;
    };

    const read = (target: EventTarget | null) => {
      const el = target instanceof Element
        ? target.closest<HTMLElement>("[data-cursor], a, button")
        : null;
      const next = (el?.dataset.cursor as CursorState | undefined) ?? (el ? "link" : "");
      if (next !== state) {
        state = next;
        ring.dataset.state = next;
      }
      label.textContent = el?.dataset.cursorLabel ?? "";
    };

    const show = (visible: boolean) => {
      shown = visible;
      dot.dataset.visible = String(visible);
      ring.dataset.visible = String(visible);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        rx = x;
        ry = y;
        root.dataset.cursor = "custom";
        show(true);
      }
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      read(e.target);
      if (!raf) raf = requestAnimationFrame(follow);
    };

    const onDown = () => ring.setAttribute("data-pressed", "");
    const onUp = () => ring.removeAttribute("data-pressed");
    const onLeave = () => show(false);
    const onOver = (e: PointerEvent) => read(e.target);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      delete root.dataset.cursor;
    };
  }, []);

  return (
    <div className={styles.root} aria-hidden>
      <div ref={ringRef} className={styles.ring}>
        <div className={styles.outline} />
        <div className={styles.disc} />
        <span ref={labelRef} className={styles.label} />
      </div>
      <div ref={dotRef} className={styles.dot} />
    </div>
  );
};

export default Cursor;
