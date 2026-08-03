"use client";
import { MenuItem } from "../data";
import FaceMedia from "../FaceMedia";
import MenuList from "./MenuList";
import styles from "./screenIndex.module.scss";
import { useLanguage } from "@/i18n/context";

interface Props {
  items: MenuItem[];
  selectedIdx: number;
  accent: string;
  active: boolean;
  isMobile: boolean;
  query: string;
  faceSrc: string;
  replayKey: number;
  onOpen: (idx: number) => void;
  onType?: (ch: string) => void;
  onCommand?: (cmd: string) => void;
}

const Key = ({ children }: { children: React.ReactNode }) => (
  <kbd className={styles.kbd}>{children}</kbd>
);

const ScreenIndex = ({
  items,
  selectedIdx,
  accent,
  active,
  isMobile,
  query,
  faceSrc,
  replayKey,
  onOpen,
  onType,
  onCommand,
}: Props) => {
  const { t } = useLanguage();
  const hm = t.overlay.hintMenu;

  return (
    <div
      className={styles.root}
      data-mobile={isMobile || undefined}
      data-active={active || undefined}
    >
      <div className={styles.titleBar}>
        <span className={styles.trafficDots} aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.path}>~/portfolio/index.md</span>
        {!isMobile && (
          <span className={styles.hint}>
            <Key>↑↓</Key> {hm.nav} · <Key>↵</Key> {hm.open} · <Key>esc</Key> {hm.clear}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.indexPane}>
          <MenuList
            items={items}
            selectedIdx={selectedIdx}
            accent={accent}
            isMobile={isMobile}
            query={query}
            onOpen={onOpen}
            onType={onType}
            onCommand={onCommand}
          />
        </div>

        <aside className={styles.facePane}>
          <div className={styles.faceCard}>
            <FaceMedia src={faceSrc} replayKey={replayKey} />
          </div>
          <div className={styles.faceCaption}>
            <span className={styles.statusDot} style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
            <span>{t.meta.role}</span>
            <span className={styles.captionLoc}>{t.meta.location}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ScreenIndex;
