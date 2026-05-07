import { MenuItem } from "../data";
import styles from "./codeOverlay.module.scss";

interface Props {
  items: MenuItem[];
  selectedIdx: number;
  accent: string;
  isMobile: boolean;
  query: string;
  onOpen: (idx: number) => void;
}

const MenuList = ({ items, selectedIdx, accent, isMobile, query, onOpen }: Props) => (
  <div className={styles.menu} data-mobile={isMobile || undefined}>
    <div className={styles.menuHeader}>
      <span style={{ color: accent }}>{"// "}</span>
      {isMobile ? "Tap a section or use a keyboard." : "Type to filter, then press enter."}
    </div>

    <div
      className={styles.commandLine}
      style={{ borderColor: `color-mix(in oklch, ${accent} 26%, transparent)` }}
    >
      <span className={styles.commandPrompt} style={{ color: accent }}>
        {">"}
      </span>
      <span className={styles.commandValue} data-empty={!query || undefined}>
        {query}
      </span>
      <span className={styles.commandCursor} style={{ background: accent }} />
    </div>

    <div className={styles.resultMeta}>
      {items.length > 0 ? `${items.length} result${items.length === 1 ? "" : "s"}` : "No matches"}
    </div>

    {items.length === 0 ? (
      <div className={styles.emptyState}>
        <span style={{ color: accent }}>{"// "}</span>
        {`No section matches "${query}".`}
      </div>
    ) : (
      items.map((item, i) => {
        const selected = i === selectedIdx;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen(i)}
            className={styles.menuItem}
            data-selected={selected || undefined}
            data-mobile={isMobile || undefined}
            style={{
              background: selected ? `color-mix(in oklch, ${accent} 18%, transparent)` : "transparent",
              borderLeft: `2px solid ${selected ? accent : "transparent"}`,
            }}
          >
            <span className={styles.menuArrow} style={{ color: selected ? accent : "#3a4049" }}>
              {selected ? ">" : " "}
            </span>
            <span className={styles.menuLabel} data-selected={selected || undefined}>
              {item.label}
            </span>
            <span className={styles.menuDesc}>{`// ${item.desc}`}</span>
          </button>
        );
      })
    )}
  </div>
);

export default MenuList;
