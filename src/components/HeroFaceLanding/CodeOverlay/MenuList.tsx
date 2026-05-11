"use client";
import { useState } from "react";
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
  onType?: (ch: string) => void;
  onCommand?: (cmd: string) => void;
}

const MenuList = ({ items, selectedIdx, accent, isMobile, query, onOpen, onType, onCommand }: Props) => {
  const { t } = useLanguage();
  const m = t.overlay.menu;
  const [inputFocused, setInputFocused] = useState(false);

  const resultLabel =
    items.length === 1
      ? `1 ${m.result}`
      : `${items.length} ${m.results}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (newVal.length > query.length) {
      for (const ch of newVal.slice(query.length)) onType?.(ch);
    } else {
      const removed = query.length - newVal.length;
      for (let i = 0; i < removed; i++) onCommand?.("backspace");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")     { e.preventDefault(); onCommand?.("enter"); }
    if (e.key === "Escape")    { onCommand?.("esc"); }
    if (e.key === "ArrowUp")   { e.preventDefault(); onCommand?.("arrowup"); }
    if (e.key === "ArrowDown") { e.preventDefault(); onCommand?.("arrowdown"); }
  };

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
        <span
          className={styles.commandCursor}
          style={{ background: accent }}
          data-paused={(isMobile && !inputFocused) || undefined}
        />

        {/* Transparent overlay input — captures mobile soft-keyboard typing */}
        {isMobile && onType && (
          <input
            type="text"
            className={styles.mobileInput}
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="search"
            aria-label="type to filter"
          />
        )}
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
