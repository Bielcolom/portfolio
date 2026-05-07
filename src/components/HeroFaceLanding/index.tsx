"use client";
import { useDeferredValue, useEffect, useState } from "react";
import { MENU_ITEMS, MenuItem } from "./data";
import FaceMedia from "./FaceMedia";
import Monitor from "./Monitor";
import MagicKeyboard from "./MagicKeyboard";
import CodeOverlay, { EditorView } from "./CodeOverlay";
import styles from "./heroFaceLanding.module.scss";
import { useIsMobile } from "./useIsMobile";
import { useLanguage } from "@/i18n/context";

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
  const { t } = useLanguage();
  const [phase, setPhase] = useState(-1);
  const [query, setQuery] = useState("");
  const [viewportWidth, setViewportWidth] = useState(0);

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

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const interactive = phase >= 2;

  // Editor state machine
  const [editorView, setEditorView] = useState<EditorView>("closed");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const deferredQuery = useDeferredValue(query);

  const localizedItems = MENU_ITEMS.map((item) => ({
    ...item,
    desc: t.items[item.id as keyof typeof t.items] ?? item.desc,
  }));

  const filteredItems = localizedItems.filter((item) => {
    const needle = deferredQuery.trim().toLowerCase();
    if (!needle) return true;

    const haystack = [item.id, item.label, item.desc].join(" ").toLowerCase();
    return haystack.includes(needle);
  });
  const safeSelectedIdx = filteredItems[selectedIdx] ? selectedIdx : 0;

  useEffect(() => {
    const reset = window.requestAnimationFrame(() => {
      setEditorView("closed");
      setSelectedIdx(0);
      setActiveItem(null);
      setQuery("");
    });

    return () => {
      window.cancelAnimationFrame(reset);
    };
  }, [replayKey]);

  const appendQuery = (value: string) => {
    setQuery((prev) => prev + value.toLowerCase());
    setSelectedIdx(0);
  };

  const closeAndReset = () => {
    setEditorView("closed");
    setActiveItem(null);
    setSelectedIdx(0);
    setQuery("");
  };

  // Keyboard input — only meaningful on desktop, but harmless on mobile
  const handleType = (ch: string) => {
    if (!ch.trim() && ch !== " ") return;

    if (editorView !== "menu") {
      setEditorView("menu");
      setActiveItem(null);
    }

    appendQuery(ch);
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
      if (cmd === "arrowdown" && filteredItems.length > 0) {
        setSelectedIdx((i) => (i + 1) % filteredItems.length);
      } else if (cmd === "arrowup" && filteredItems.length > 0) {
        setSelectedIdx((i) => (i - 1 + filteredItems.length) % filteredItems.length);
      } else if (cmd === "enter") {
        const item = filteredItems[safeSelectedIdx];
        if (!item) return;

        setActiveItem(item);
        setEditorView("viewing");
      } else if (cmd === "esc") {
        closeAndReset();
      } else if (cmd === "backspace") {
        setQuery((prev) => prev.slice(0, -1));
        setSelectedIdx(0);
      }
      return;
    }
    // viewing
    if (cmd === "enter" || cmd === "arrowleft") {
      setEditorView("menu");
      setActiveItem(null);
    } else if (cmd === "esc") {
      closeAndReset();
    } else if (cmd === "backspace") {
      setEditorView("menu");
      setActiveItem(null);
      setQuery((prev) => prev.slice(0, -1));
      setSelectedIdx(0);
    } else if (cmd === "arrowdown" && filteredItems.length > 0) {
      const next = (selectedIdx + 1) % filteredItems.length;
      setSelectedIdx(next);
      setActiveItem(filteredItems[next]);
    } else if (cmd === "arrowup" && filteredItems.length > 0) {
      const prev = (selectedIdx - 1 + filteredItems.length) % filteredItems.length;
      setSelectedIdx(prev);
      setActiveItem(filteredItems[prev]);
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
    setActiveItem(filteredItems[idx] ?? null);
    setEditorView("viewing");
  };
  const backToMenu = () => {
    setEditorView("menu");
    setActiveItem(null);
  };
  const closeEditor = closeAndReset;

  const monitorReveal = phase >= 1 ? 1 : 0;
  const desktopStageWidth = Math.min(monitorWidth + 12, 76);
  const desktopMaxWidth = viewportWidth > 0 ? Math.min(900, viewportWidth - 64) : 980;
  const stageWidthPx = viewportWidth > 0
    ? Math.min((desktopStageWidth / 100) * viewportWidth, desktopMaxWidth)
    : desktopMaxWidth;
  const keyboardScale = isMobile
    ? 1
    : Math.max(1, Math.min(1.32, (stageWidthPx - 24) / 580));

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
          width: isMobile ? "94%" : `${desktopStageWidth}%`,
          maxWidth: isMobile ? 560 : desktopMaxWidth,
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
              items={filteredItems}
              selectedIdx={safeSelectedIdx}
              activeItem={activeItem}
              accent={accent}
              active={interactive}
              isMobile={isMobile}
              query={query}
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
              scale={keyboardScale}
              onType={handleType}
              onCommand={handleCommand}
            />
          </div>
        )}
      </div>

      {/* Bottom meta line */}
      <div className={styles.meta} data-visible={phase >= 2 || undefined} data-mobile={isMobile || undefined}>
        <span>{t.meta.role}</span>
        <span style={{ color: accent }}>● GABRIEL COLOM MOLL</span>
        {!isMobile && <span>{t.meta.portfolio}</span>}
      </div>
    </div>
  );
};

export default HeroFaceLanding;
