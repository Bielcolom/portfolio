"use client";
import { EditorView, MenuItem } from "../data";
import MenuList from "./MenuList";
import CodeView from "./CodeView";
import SocialsView from "./SocialsView";
import styles from "./codeOverlay.module.scss";
import { useLanguage } from "@/i18n/context";

export type { EditorView };

interface Props {
  view: EditorView;
  items: MenuItem[];
  selectedIdx: number;
  activeItem: MenuItem | null;
  accent: string;
  active: boolean;
  isMobile: boolean;
  query: string;
  onOpen: (idx: number) => void;
  onBack: () => void;
  onClose: () => void;
  onType?: (ch: string) => void;
  onCommand?: (cmd: string) => void;
}

const Key = ({ children }: { children: React.ReactNode }) => (
  <kbd className={styles.kbd}>{children}</kbd>
);

const CodeOverlay = ({
  view,
  items,
  selectedIdx,
  activeItem,
  accent,
  active,
  isMobile,
  query,
  onOpen,
  onBack,
  onClose,
  onType,
  onCommand,
}: Props) => {
  const { t } = useLanguage();
  const hm = t.overlay.hintMenu;
  const hv = t.overlay.hintViewing;

  if (view === "closed") {
    return (
      <div
        className={styles.closed}
        data-active={active || undefined}
        data-mobile={isMobile || undefined}
      >
        <div
          className={styles.pill}
          style={{ border: `1px solid color-mix(in oklch, ${accent} 30%, transparent)` }}
        >
          <span
            className={styles.pillDot}
            style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
          />
          {isMobile ? t.overlay.closed.mobile : t.overlay.closed.desktop}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editor} data-mobile={isMobile || undefined}>
      <div className={styles.titleBar}>
        {isMobile && view === "viewing" ? (
          <button
            type="button"
            onClick={onBack}
            className={styles.backBtn}
            style={{ color: accent }}
          >
            {"<-"} <span>{t.overlay.back}</span>
          </button>
        ) : (
          !isMobile ? <span className={`${styles.dot} ${styles.dotRed}`} onClick={onClose} /> : null
        )}

        <span className={styles.path}>
          ~/portfolio/{view === "viewing" && activeItem ? `${activeItem.id}.ts` : "index.ts"}
        </span>

        {!isMobile && (
          <span className={styles.hint}>
            {view === "menu" ? (
              <>
                <Key>↑↓</Key> {hm.nav} · <Key>↵</Key> {hm.open} · <Key>esc</Key> {hm.close}
              </>
            ) : (
              <>
                <Key>↵</Key> {hv.back} · <Key>↑↓</Key> {hv.next} · <Key>esc</Key> {hv.close}
              </>
            )}
          </span>
        )}

        {isMobile && view === "menu" && (
          <button type="button" onClick={onClose} className={styles.closeX}>
            x
          </button>
        )}
      </div>

      <div className={styles.body}>
        {view === "menu" ? (
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
        ) : activeItem?.id === "socials" ? (
          <SocialsView accent={accent} />
        ) : (
          <CodeView item={activeItem} />
        )}
      </div>
    </div>
  );
};

export default CodeOverlay;
