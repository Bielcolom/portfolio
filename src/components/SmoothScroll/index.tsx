"use client";
import Lenis from "lenis";
import { useEffect } from "react";

let lenis: Lenis | null = null;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scrolls to an element or offset: inertia when Lenis runs, native otherwise. */
export function scrollToTarget(target: HTMLElement | number, immediate = false) {
  if (lenis) {
    // force: an overlay may have stopped Lenis in the same tick
    lenis.scrollTo(target, { immediate, duration: 1.4, force: true });
    return;
  }
  const top = typeof target === "number"
    ? target
    : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: immediate || reducedMotion() ? "auto" : "smooth" });
}

/** Pauses the page scroll while an overlay owns the screen. */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
}

/**
 * Inertia scroll for wheel and trackpad; touch keeps the platform's own
 * scroll. Off under reduced motion, where jumps stay instant.
 */
const SmoothScroll = () => {
  useEffect(() => {
    // Content hidden for scroll reveals only stays hidden once the client has
    // taken over; the inline script in the layout reverts it otherwise
    document.documentElement.dataset.ready = "true";

    if (reducedMotion()) return;
    lenis = new Lenis({ lerp: 0.11, anchors: true, autoRaf: true });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
};

export default SmoothScroll;
