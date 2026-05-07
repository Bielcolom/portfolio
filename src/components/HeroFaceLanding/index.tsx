"use client";
import { useEffect, useState } from "react";
import { MENU_ITEMS, MenuItem } from "./data";
import FaceMedia from "./FaceMedia";
import Monitor from "./Monitor";
import MagicKeyboard from "./MagicKeyboard";
import CodeOverlay, { EditorView } from "./CodeOverlay";
import styles from "./heroFaceLanding.module.scss";
import { useIsMobile } from "./useIsMobile";

interface Props {
  /** Path to the face media — `.mp4` autoplays as video, otherwise treated as image. */
  faceSrc?: string;
  /** Accent color (hex / oklch). Default electric blue. */
  accent?: string;
  /** ms for the zoom-out + reveal transition. */
  duration?: number;
  /** 0..1 — bezel + screen accent glow strength. */
  glowIntensity?: number;
  /** Bumping this restarts the animation. */
  replayKey?: number;
  /** Show CRT scanlines on the monitor screen. */
  showScanlines?: boolean;
  /** Bigger = wider monitor on desktop (% of viewport width). */
  monitorWidth?: number;
}

const HeroFaceLanding = ({
  faceSrc = "/face.mp4",
  accent = "#3ddcff",
  duration = 1400,
  glowIntensity = 0.6,
  replayKey = 0,
  showScanlines = true,
  monitorWidth = 60,
}: Props) => {
  const isMobile = useIsMobile(768);
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    let complete = 0;

    const start = window.requestAnimationFrame(() => {
      setPhase(1);
      complete = window.setTimeout(() => setPhase(2), duration + 100);
    });

    return () => {
      window.cancelAnimationFrame(start);
      window.clearTimeout(complete);
    };
  }, [replayKey, duration]);

  const interactive = phase >= 2;

  // Editor state machine
  const [editorView, setEditorView] = useState<EditorView>("closed");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const reset = window.requestAnimationFrame(() => {
      setEditorView("closed");
      setSelectedIdx(0);
      setActiveItem(null);
    });

    return () => {
      window.cancelAnimationFrame(reset);
    };
  }, [replayKey]);

  // Keyboard input — only meaningful on desktop, but harmless on mobile
  const handleType = () => {
    if (editorView === "closed") {
      setEditorView("menu");
      setSelectedIdx(0);
    }
  };

  const handleCommand = (cmd: string) => {
    if (editorView === "closed") {
      if (cmd === "enter" || cmd === "arrowdown" || cmd === "arrowup") {
        setEditorView("menu");
        setSelectedIdx(0);
      }
      return;
    }
    if (editorView === "menu") {
      if (cmd === "arrowdown") {
        setSelectedIdx((i) => (i + 1) % MENU_ITEMS.length);
      } else if (cmd === "arrowup") {
        setSelectedIdx((i) => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (cmd === "enter") {
        setActiveItem(MENU_ITEMS[selectedIdx]);
        setEditorView("viewing");
      } else if (cmd === "esc") {
        setEditorView("closed");
      }
      return;
    }
    // viewing
    if (cmd === "enter" || cmd === "backspace" || cmd === "arrowleft") {
      setEditorView("menu");
      setActiveItem(null);
    } else if (cmd === "esc") {
      setEditorView("closed");
      setActiveItem(null);
    } else if (cmd === "arrowdown") {
      const next = (selectedIdx + 1) % MENU_ITEMS.length;
      setSelectedIdx(next);
      setActiveItem(MENU_ITEMS[next]);
    } else if (cmd === "arrowup") {
      const prev = (selectedIdx - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
      setSelectedIdx(prev);
      setActiveItem(MENU_ITEMS[prev]);
    }
  };

  // Touch helpers (mobile)
  const openMenu = () => {
    if (editorView === "closed") {
      setEditorView("menu");
      setSelectedIdx(0);
    }
  };
  const openItem = (idx: number) => {
    setSelectedIdx(idx);
    setActiveItem(MENU_ITEMS[idx]);
    setEditorView("viewing");
  };
  const backToMenu = () => {
    setEditorView("menu");
    setActiveItem(null);
  };
  const closeEditor = () => {
    setEditorView("closed");
    setActiveItem(null);
  };

  const monitorReveal = phase >= 1 ? 1 : 0;

  return (
    <div className={styles.root}>
      {/* Oversized editorial title */}
      <div className={styles.titleLayer} data-visible={phase >= 2 || undefined}>
        <div
          className={styles.title}
          style={{ WebkitTextStroke: `1px ${accent}` }}
        >
          BIEL<br />COLOM
        </div>
      </div>

      {/* Monitor + keyboard */}
      <div
        className={styles.stage}
        style={{
          width: isMobile ? "94%" : `${monitorWidth}%`,
          maxWidth: isMobile ? 520 : 720,
          opacity: monitorReveal,
          transform: `scale(${monitorReveal ? 1 : 0.92}) translateY(${monitorReveal ? 0 : 24}px)`,
          transition: `opacity ${duration * 0.5}ms ease-out, transform ${duration}ms cubic-bezier(0.16, 0.84, 0.39, 1)`,
        }}
      >
        <Monitor accent={accent} glowIntensity={glowIntensity}>
          <div
            className={styles.screen}
            data-mobile={isMobile || undefined}
            data-clickable={editorView === "closed" && interactive || undefined}
            onClick={editorView === "closed" && interactive ? openMenu : undefined}
          >
            <div className={styles.screenFace}>
              <FaceMedia src={faceSrc} replayKey={replayKey} />
            </div>

            <CodeOverlay
              view={editorView}
              items={MENU_ITEMS}
              selectedIdx={selectedIdx}
              activeItem={activeItem}
              accent={accent}
              active={interactive}
              isMobile={isMobile}
              onOpen={openItem}
              onBack={backToMenu}
              onClose={closeEditor}
            />

            {showScanlines && <div className={styles.scanlines} />}
            <div className={styles.glare} />
          </div>
        </Monitor>

        {!isMobile && (
          <div className={styles.keyboardWrap}>
            <MagicKeyboard
              accent={accent}
              active={interactive}
              onType={handleType}
              onCommand={handleCommand}
            />
          </div>
        )}
      </div>

      {/* Bottom meta line */}
      <div className={styles.meta} data-visible={phase >= 2 || undefined} data-mobile={isMobile || undefined}>
        <span>Full-stack dev</span>
        <span style={{ color: accent }}>● GABRIEL COLOM MOLL</span>
        {!isMobile && <span>Portfolio / 01</span>}
      </div>
    </div>
  );
};

export default HeroFaceLanding;
