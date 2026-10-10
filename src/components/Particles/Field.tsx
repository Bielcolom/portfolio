"use client";
import { useEffect, useRef } from "react";
import { chapterFloat } from "@/components/Story/chapters";
import { createEngine, type Engine, type Frame } from "./engine";
import styles from "./particles.module.scss";

/** portrait, cloud, stack, chat, devices, card, scatter */
const LAST = 6;
const ALPHA = [1, 0.4, 1, 1, 1, 1, 0];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * Where a shape stands on screen: centre x, centre y, pixels per unit. The
 * cloud fills the viewport; every other shape sits in the story's stage box,
 * measured live, so the layout decides and the particles follow it.
 */
function stage(index: number, vw: number, vh: number, box: DOMRect | undefined): [number, number, number] {
  const narrow = vw < 900;
  if (index === 1 || !box) return [0, 0, Math.max(vw, vh) * (narrow ? 0.46 : 0.34)];
  return [
    box.left + box.width / 2 - vw / 2,
    vh / 2 - (box.top + box.height / 2),
    Math.min(box.width, box.height) * (narrow ? 0.4 : 0.34),
  ];
}

/**
 * The fixed canvas behind the page. Scroll position decides which shape the
 * particles hold: the hero's portrait dissolves into a cloud behind the
 * statement, which forms each chapter of the "what I do" story in turn and
 * scatters when the projects cover it. Never runs without WebGL 2.
 */
const Field = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = document.documentElement;
    if (!canvas) return;

    if (!document.createElement("canvas").getContext("webgl2")) {
      root.dataset.particles = "off";
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.innerWidth < 900;
    const modest = (navigator.hardwareConcurrency ?? 8) <= 4;
    const [cols, rows] = narrow || modest ? [96, 128] : [128, 170];
    const dpr = Math.min(window.devicePixelRatio || 1, narrow ? 1.75 : 2);

    let engine: Engine | null = null;
    let raf = 0;
    let started = 0;
    let last = 0;
    let s = -1;
    let portraitOpacity = "";
    let shown = false;

    const pointer = { x: -1e5, y: -1e5, nx: 0, ny: 0, force: 0, seen: false };
    const spin = { yaw: 0, pitch: 0, vYaw: 0, vPitch: 0, dragging: false, id: -1, lastX: 0, lastY: 0 };
    const look = { yaw: 0, pitch: 0 };

    const find = (name: string) => document.querySelector<HTMLElement>(`[data-particles="${name}"]`);
    const hero = find("hero");
    const portrait = find("portrait");
    const story = find("story");
    const stageBox = find("stage");
    const exit = find("exit");

    /* Scroll to story position: 0 portrait … 6 scattered. The dissolve keys
       off how far the hero has scrolled, not where the next section starts:
       on phones the hero can end a few pixels inside the viewport */
    const target = (vh: number) => {
      if (!hero || !story || !exit) return 0;
      const h = hero.getBoundingClientRect();
      const st = story.getBoundingClientRect();
      const ex = exit.getBoundingClientRect();
      const toCloud = clamp01((-h.top - vh * 0.04) / (vh * 0.55));
      const toFirst = clamp01((vh - st.top) / vh);
      const chapters = chapterFloat(clamp01(-st.top / Math.max(1, st.height - vh)));
      const toScatter = clamp01((vh - ex.top) / (vh * 0.7));
      return toCloud + toFirst + chapters + toScatter;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!engine) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      // The canvas box, not the window: it excludes the scrollbar, as the DOM rects do
      const vw = canvas.clientWidth;
      const vh = canvas.clientHeight;

      const goal = target(vh);
      if (s < 0 || reduced) s = goal;
      else s += (goal - s) * (1 - Math.exp(-dt * 6));
      if (Math.abs(goal - s) < 0.0005) s = goal;

      // The video steps back as soon as the particles start to leave it
      const opacity = String(1 - smoothstep(0, 0.06, s));
      if (portrait && opacity !== portraitOpacity) {
        portrait.style.opacity = opacity;
        portraitOpacity = opacity;
      }

      const visible = s > 0.0005 && s < LAST - 0.0005;
      if (visible !== shown) {
        canvas.dataset.visible = String(visible);
        shown = visible;
      }
      if (!visible) return;

      const from = Math.min(LAST - 1, Math.floor(s));
      const morph = s - from;
      const to = from + 1;

      // Look toward the pointer, keep any spin the visitor gave it
      look.yaw += (pointer.nx * 0.35 - look.yaw) * (1 - Math.exp(-dt * 3));
      look.pitch += (-pointer.ny * 0.22 - look.pitch) * (1 - Math.exp(-dt * 3));
      if (!spin.dragging) {
        spin.yaw += spin.vYaw;
        spin.pitch += spin.vPitch;
        const friction = Math.exp(-dt * 2.5);
        spin.vYaw *= friction;
        spin.vPitch *= friction;
        spin.pitch *= Math.exp(-dt * 1.5);
      }
      pointer.force *= pointer.seen ? 1 : Math.exp(-dt * 2.5);

      const t = reduced ? 0 : (now - started) / 1000;
      const idle = reduced ? 0 : Math.sin(t * 0.25) * 0.38;

      const r = portrait?.getBoundingClientRect();
      const cell = r ? r.width / cols : 3;
      const box = stageBox?.getBoundingClientRect();

      const f: Frame = {
        from,
        to,
        morph,
        rect: r ? [r.left - vw / 2, vh / 2 - r.top, r.width, r.height] : [0, 0, 0, 0],
        fromStage: stage(from, vw, vh, box),
        toStage: stage(to, vw, vh, box),
        fromAlpha: ALPHA[from],
        toAlpha: ALPHA[to],
        globalAlpha: reduced ? 1 : Math.min(1, (now - started) / 700),
        yaw: idle + look.yaw + spin.yaw,
        pitch: Math.max(-0.7, Math.min(0.7, look.pitch + spin.pitch)),
        mouse: [pointer.x - vw / 2, vh / 2 - pointer.y],
        mouseForce: pointer.force,
        time: t,
        portraitSize: cell * 1.04,
        size: vw < 900 ? 2 : 2.4,
      };
      engine.render(f);
    };

    const resize = () => engine?.resize(canvas.clientWidth, canvas.clientHeight);

    const onMove = (e: PointerEvent) => {
      if (spin.dragging && e.pointerId === spin.id) {
        const dx = e.clientX - spin.lastX;
        const dy = e.clientY - spin.lastY;
        spin.lastX = e.clientX;
        spin.lastY = e.clientY;
        spin.vYaw = dx * 0.006;
        spin.vPitch = dy * 0.004;
        spin.yaw += spin.vYaw;
        spin.pitch += spin.vPitch;
      }
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.nx = (e.clientX / canvas.clientWidth) * 2 - 1;
      pointer.ny = (e.clientY / canvas.clientHeight) * 2 - 1;
      pointer.force = 1;
      pointer.seen = true;
    };

    const onDown = (e: PointerEvent) => {
      const zone = (e.target as Element | null)?.closest?.("[data-particles-drag]");
      if (!zone) return;
      spin.dragging = true;
      spin.id = e.pointerId;
      spin.lastX = e.clientX;
      spin.lastY = e.clientY;
      // A touch also pushes the particles where the finger lands
      if (e.pointerType !== "mouse") {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.force = 1;
        pointer.seen = false;
      }
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId === spin.id) spin.dragging = false;
    };

    const onLeave = () => {
      pointer.seen = false;
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const start = () => {
      try {
        engine = createEngine(canvas, { cols, rows, dpr, reduced });
        resize();

        const video = portrait?.querySelector("video");
        if (video && (video.currentTime > 0 || !video.paused) && !portrait?.querySelector("img")) {
          engine.useVideo(video);
        } else {
          engine.useImage("/hero-last.jpg");
        }

        root.dataset.particles = "on";
        started = performance.now();
        raf = requestAnimationFrame(frame);
      } catch {
        root.dataset.particles = "off";
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      root.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      engine?.dispose();
      if (portrait) portrait.style.opacity = "";
      delete root.dataset.particles;
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />;
};

export default Field;
