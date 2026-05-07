"use client";
import { MenuItem } from "../data";
import MenuList from "./MenuList";
import CodeView from "./CodeView";
import styles from "./codeOverlay.module.scss";

export type EditorView = "closed" | "menu" | "viewing";

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
}: Props) => {
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
          {isMobile ? "Tap to start" : "Type to search..."}
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
            {"<-"} <span>back</span>
          </button>
        ) : (
          <>
            <span className={`${styles.dot} ${styles.dotRed}`} onClick={onClose} />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
          </>
        )}

        <span className={styles.path}>
          ~/portfolio/{view === "viewing" && activeItem ? `${activeItem.id}.ts` : "index.ts"}
        </span>

        {!isMobile && (
          <span className={styles.hint}>
            {view === "menu" ? (
              <>
                type to filter · <Key>up</Key><Key>down</Key> nav · <Key>enter</Key> open ·{" "}
                <Key>del</Key> erase · <Key>esc</Key> close
              </>
            ) : (
              <>
                <Key>enter</Key> back · <Key>up</Key><Key>down</Key> next · type to search ·{" "}
                <Key>esc</Key> close
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
          />
        ) : (
          <CodeView item={activeItem} />
        )}
      </div>
    </div>
  );
};

export default CodeOverlay;
