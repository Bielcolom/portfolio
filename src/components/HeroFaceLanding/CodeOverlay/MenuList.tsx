import { MenuItem } from "../data";
import styles from "./codeOverlay.module.scss";

interface Props {
  items: MenuItem[];
  selectedIdx: number;
  accent: string;
  isMobile: boolean;
  onOpen: (idx: number) => void;
}

const MenuList = ({ items, selectedIdx, accent, isMobile, onOpen }: Props) => (
  <div className={styles.menu} data-mobile={isMobile || undefined}>
    <div className={styles.menuHeader}>
      <span style={{ color: accent }}>{"// "}</span>
      {isMobile ? "Tap a section." : "Pick a section. Use the arrow keys."}
    </div>
    {items.map((item, i) => {
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
            {selected ? "›" : " "}
          </span>
          <span className={styles.menuLabel} data-selected={selected || undefined}>
            {item.label}
          </span>
          <span className={styles.menuDesc}>// {item.desc}</span>
        </button>
      );
    })}
  </div>
);

export default MenuList;
