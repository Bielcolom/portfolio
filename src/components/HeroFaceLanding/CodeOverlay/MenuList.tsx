"use client";
import { MenuItem } from "../data";
import styles from "./codeOverlay.module.scss";
import { useLanguage } from "@/i18n/context";

interface Props {
  items: MenuItem[];
  selectedIdx: number;
  accent: string;
  isMobile: boolean;
  query: string;
  onOpen: (idx: number) => void;
}

const MenuList = ({ items, selectedIdx, accent, isMobile, query, onOpen }: Props) => {
  const { t } = useLanguage();
  const m = t.overlay.menu;

  const resultLabel =
    items.length === 1
      ? `1 ${m.result}`
      : `${items.length} ${m.results}`;

  return (
    <div className={styles.menu} data-mobile={isMobile || undefined}>
      <div className={styles.menuHeader}>
        <span style={{ color: accent }}>{"// "}</span>
        {isMobile ? m.headerMobile : m.headerDesktop}
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
        {items.length > 0 ? resultLabel : m.noMatches}
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <span style={{ color: accent }}>{"// "}</span>
          {m.noSection.replace("{query}", query)}
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
                background: selected ? `color-mix(in oklch, ${accent} 18%, transparent)` : undefined,
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
};

export default MenuList;
