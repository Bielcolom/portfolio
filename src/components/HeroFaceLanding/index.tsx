"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MENU_ITEMS, MenuItem } from "./data";
import PhoneFrame from "./PhoneFrame";
import MagicKeyboard from "./MagicKeyboard";
import ScreenIndex from "./ScreenIndex";
import styles from "./heroFaceLanding.module.scss";
import { useLanguage } from "@/i18n/context";
import useAnimationPhase from "./useAnimationPhase";
import useViewportWidth, { useViewportHeight } from "./useViewportWidth";
import useEditorState from "./useEditorState";

interface Props {
  /** Path to the face media — `.mp4` autoplays as video, otherwise treated as image. */
  faceSrc?: string;
  /** Accent color (hex / oklch). Default electric blue. */
  accent?: string;
  /** ms for the zoom-out + reveal transition. */
  duration?: number;
  /** 0..1 — screen ambient glow strength. */
  glowIntensity?: number;
  /** Bigger = wider screen on desktop (% of viewport width). */
  monitorWidth?: number;
}

const TILT_SPRING = { stiffness: 120, damping: 18, mass: 0.5 };

const NAME = "Gabriel Colom Moll";
/** Spring for each letter popping in as it is "typed". */
const CHAR_SPRING = { type: "spring", stiffness: 520, damping: 17, mass: 0.6 } as const;

const HeroFaceLanding = ({
  faceSrc = "/face.mp4",
  accent = "#3ddcff",
  duration = 1400,
  glowIntensity = 0.6,
  monitorWidth = 60,
}: Props) => {
  const { t } = useLanguage();
  const phase = useAnimationPhase(duration);
  const viewportWidth = useViewportWidth();
  const viewportHeight = useViewportHeight();
  const isMobile = viewportWidth > 0 && viewportWidth < 768;

  const localizedItems: MenuItem[] = MENU_ITEMS.map((item, i) => {
    const tr = t.items[item.id as keyof typeof t.items];
    return { ...item, num: String(i + 1).padStart(2, "0"), desc: tr.desc };
  });

  const scrollToSection = (item: MenuItem) => {
    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { selectedIdx, query, filteredItems, handleType, handleCommand, openItem } =
    useEditorState(localizedItems, scrollToSection);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [4.5, -4.5]), TILT_SPRING);
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), TILT_SPRING);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMobile || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    mx.set(0);
    my.set(0);
  };

  const interactive = phase >= 2;
  const revealed = phase >= 1;

  /* Ghost-typing intro: the name types itself letter by letter,
     flashing the matching key on the MagicKeyboard in sync.
     Starts during the reveal, while the video is already playing */
  const [typed, setTyped] = useState(0);
  const [ghost, setGhost] = useState<{ char: string; seq: number } | null>(null);

  useEffect(() => {
    if (!revealed) {
      const id = window.requestAnimationFrame(() => {
        setTyped(0);
        setGhost(null);
      });
      return () => window.cancelAnimationFrame(id);
    }

    let i = 0;
    let timer: number;
    const tick = () => {
      i += 1;
      setTyped(i);
      setGhost({ char: NAME[i - 1], seq: i });
      if (i < NAME.length) {
        timer = window.setTimeout(tick, 60 + Math.random() * 70);
      }
    };
    timer = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timer);
  }, [revealed]);

  const nameComplete = typed >= NAME.length;

  const desktopStageWidth = Math.min(monitorWidth + 12, 76);
  const widthCap = viewportWidth > 0 ? viewportWidth - 64 : 980;
  /* Screen + keyboard must fit inside the viewport height */
  const heightCap = viewportHeight > 0 ? (viewportHeight - 380) * 1.7 : 980;
  const desktopMaxWidth = Math.max(420, Math.min(900, widthCap, heightCap));
  const stageWidthPx = viewportWidth > 0
    ? Math.min((desktopStageWidth / 100) * viewportWidth, desktopMaxWidth)
    : desktopMaxWidth;
  const keyboardScale = isMobile
    ? 1
    : Math.max(1, Math.min(1.32, (stageWidthPx - 24) / 580));

  const screenContent = (
    <div className={styles.screen}>
      <ScreenIndex
        items={filteredItems}
        selectedIdx={selectedIdx}
        accent={accent}
        active={revealed}
        isMobile={isMobile}
        query={query}
        faceSrc={faceSrc}
        onOpen={openItem}
        onType={isMobile ? handleType : undefined}
        onCommand={isMobile ? handleCommand : undefined}
      />
      <div className={styles.glare} />
    </div>
  );

  return (
    <div
      className={styles.root}
      style={{
        "--accent": accent,
        "--glow-alpha": `${Math.round(8 + glowIntensity * 8)}%`,
      } as React.CSSProperties}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      {/* Screen + interleaved title + keyboard */}
      <div
        className={styles.stage}
        style={{
          width: isMobile ? undefined : `${desktopStageWidth}%`,
          maxWidth: isMobile ? undefined : desktopMaxWidth,
          opacity: revealed ? 1 : 0,
          transform: `scale(${revealed ? 1 : 0.92}) translateY(${revealed ? 0 : 24}px)`,
          transition: `opacity ${duration * 0.5}ms ease-out, transform ${duration}ms cubic-bezier(0.16, 0.84, 0.39, 1)`,
        }}
      >
        <motion.div className={styles.tilt} style={{ rotateX: tiltX, rotateY: tiltY }}>
          <div className={styles.screenZone}>
            {isMobile ? (
              <PhoneFrame accent={accent} glowIntensity={glowIntensity}>
                {screenContent}
              </PhoneFrame>
            ) : (
              <div className={styles.screenFrame}>{screenContent}</div>
            )}

            <span className={styles.titleFront} data-visible={revealed || undefined}>
              <motion.span
                className={styles.titleInner}
                animate={
                  nameComplete
                    ? { scaleY: [1, 0.9, 1.04, 1], y: [0, 4, -3, 0] }
                    : { scaleY: 1, y: 0 }
                }
                transition={{ duration: 0.55, ease: "easeOut", times: [0, 0.3, 0.65, 1] }}
              >
                {NAME.split("").map((ch, i) => (
                  <motion.span
                    key={i}
                    className={styles.titleChar}
                    initial={false}
                    animate={
                      i < typed
                        ? { opacity: 1, scale: 1, y: 0 }
                        : { opacity: 0, scale: 0.4, y: 12 }
                    }
                    transition={CHAR_SPRING}
                  >
                    {ch === " " ? " " : ch}
                  </motion.span>
                ))}
              </motion.span>
            </span>
          </div>

          {!isMobile && (
            <div className={styles.keyboardWrap}>
              <MagicKeyboard
                accent={accent}
                active={interactive}
                scale={keyboardScale}
                ghost={ghost}
                onType={handleType}
                onCommand={handleCommand}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom meta line */}
      <div className={styles.meta} data-visible={interactive || undefined} data-mobile={isMobile || undefined}>
        <span>{t.meta.role}</span>
        <span className={styles.scrollHint}>{t.meta.scroll}</span>
      </div>
    </div>
  );
};

export default HeroFaceLanding;
