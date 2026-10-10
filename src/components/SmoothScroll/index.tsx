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

const EASE = "cubic-bezier(0.77, 0, 0.175, 1)";

/**
 * Jumps to an element as a page change: the destination wipes up over the
 * current view. `before` runs inside the transition's update, for state the
 * new snapshot must already show (a closed menu). Without view transitions,
 * or under reduced motion, it simply jumps.
 */
export function jumpTo(target: HTMLElement, before?: () => void) {
  const swap = () => {
    before?.();
    scrollToTarget(target, true);
  };

  if (reducedMotion() || typeof document.startViewTransition !== "function") {
    swap();
    return;
  }

  const transition = document.startViewTransition(swap);
  transition.ready.then(() => {
    const root = document.documentElement;
    root.animate(
      { clipPath: ["inset(100% 0 0 0)", "inset(0 0 0 0)"] },
      { duration: 900, easing: EASE, pseudoElement: "::view-transition-new(root)" },
    );
    root.animate(
      { transform: ["none", "translate3d(0, -8%, 0)"], opacity: [1, 0.3] },
      { duration: 900, easing: EASE, pseudoElement: "::view-transition-old(root)" },
    );
  }, () => {});
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
