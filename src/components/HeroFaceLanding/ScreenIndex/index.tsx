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
  query: string;
  faceSrc: string;
  facePoster?: string;
  onOpen: (idx: number) => void;
}

const Key = ({ children }: { children: React.ReactNode }) => (
  <kbd className={styles.kbd}>{children}</kbd>
);

/** Desktop-only screen content — mobile renders MenuList directly, without window chrome. */
const ScreenIndex = ({ items, selectedIdx, accent, active, query, faceSrc, facePoster, onOpen }: Props) => {
  const { t } = useLanguage();
  const hm = t.overlay.hintMenu;

  return (
    <div className={styles.root} data-active={active || undefined}>
      <div className={styles.titleBar}>
        <span className={styles.trafficDots} aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.path}>~/portfolio/index.md</span>
        <span className={styles.hint}>
          <Key>↑↓</Key> {hm.nav} · <Key>↵</Key> {hm.open}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.indexPane}>
          <MenuList
            items={items}
            selectedIdx={selectedIdx}
            accent={accent}
            isMobile={false}
            query={query}
            onOpen={onOpen}
          />
        </div>

        <aside className={styles.facePane}>
          <div className={styles.faceCard}>
            <FaceMedia src={faceSrc} poster={facePoster} />
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
