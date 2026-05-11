"use client";
import { MENU_ITEMS, MenuItem } from "./data";
import FaceMedia from "./FaceMedia";
import Monitor from "./Monitor";
import PhoneFrame from "./PhoneFrame";
import MagicKeyboard from "./MagicKeyboard";
import CodeOverlay from "./CodeOverlay";
import styles from "./heroFaceLanding.module.scss";
import { useLanguage } from "@/i18n/context";
import useAnimationPhase from "./useAnimationPhase";
import useViewportWidth from "./useViewportWidth";
import useEditorState from "./useEditorState";

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
  const { t } = useLanguage();
  const phase = useAnimationPhase(replayKey, duration);
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth > 0 && viewportWidth < 768;

  const localizedItems: MenuItem[] = MENU_ITEMS.map((item) => {
    const tr = t.items[item.id as keyof typeof t.items];
    return { ...item, desc: tr.desc, code: tr.code };
  });

  const {
    editorView,
    selectedIdx,
    activeItem,
    query,
    filteredItems,
    handleType,
    handleCommand,
    openMenu,
    openItem,
    backToMenu,
    closeEditor,
  } = useEditorState(replayKey, localizedItems);

  const interactive = phase >= 2;
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
          width: isMobile ? "63%" : `${desktopStageWidth}%`,
          maxWidth: isMobile ? 265 : desktopMaxWidth,
          opacity: monitorReveal,
          transform: `scale(${monitorReveal ? 1 : 0.92}) translateY(${monitorReveal ? 0 : 24}px)`,
          transition: `opacity ${duration * 0.5}ms ease-out, transform ${duration}ms cubic-bezier(0.16, 0.84, 0.39, 1)`,
        }}
      >
        {isMobile ? (
          <PhoneFrame accent={accent} glowIntensity={glowIntensity}>
            <div
              className={styles.screen}
              data-phone
              data-clickable={editorView === "closed" && interactive || undefined}
              onClick={editorView === "closed" && interactive ? openMenu : undefined}
            >
              <div className={styles.screenFace}>
                <FaceMedia src={faceSrc} replayKey={replayKey} />
              </div>

              <CodeOverlay
                view={editorView}
                items={filteredItems}
                selectedIdx={selectedIdx}
                activeItem={activeItem}
                accent={accent}
                active={interactive}
                isMobile={isMobile}
                query={query}
                onOpen={openItem}
                onBack={backToMenu}
                onClose={closeEditor}
                onType={handleType}
                onCommand={handleCommand}
              />

              <div className={styles.glare} />
            </div>
          </PhoneFrame>
        ) : (
          <Monitor accent={accent} glowIntensity={glowIntensity}>
            <div
              className={styles.screen}
              data-clickable={editorView === "closed" && interactive || undefined}
              onClick={editorView === "closed" && interactive ? openMenu : undefined}
            >
              <div className={styles.screenFace}>
                <FaceMedia src={faceSrc} replayKey={replayKey} />
              </div>

              <CodeOverlay
                view={editorView}
                items={filteredItems}
                selectedIdx={selectedIdx}
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
        )}

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
