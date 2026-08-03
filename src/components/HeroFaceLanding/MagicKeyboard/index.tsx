/**
 * MagicKeyboard — interactive keyboard visualization.
 * Renders a full QWERTY layout that both reflects physical keydown events
 * and is clickable (touch/mouse). Delegates typed characters and commands
 * to the parent via onType / onCommand props.
 */
"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "./magicKeyboard.module.scss";

type Cmd =
  | "enter"
  | "backspace"
  | "tab"
  | "esc"
  | "arrowup"
  | "arrowdown"
  | "arrowleft"
  | "arrowright";

interface Props {
  accent?: string;
  active?: boolean;
  scale?: number;
  /** Ghost keypress — flashes the matching key each time seq changes. */
  ghost?: { char: string; seq: number } | null;
  onType?: (ch: string) => void;
  onCommand?: (cmd: Cmd) => void;
}

interface Key {
  k: string;
  w: number;
  label?: string;
  sm?: boolean;
  deco?: boolean;
  special?: "arrows";
}

const KB_ROWS: Key[][] = [
  [
    { k: "`", w: 1 }, { k: "1", w: 1 }, { k: "2", w: 1 }, { k: "3", w: 1 },
    { k: "4", w: 1 }, { k: "5", w: 1 }, { k: "6", w: 1 }, { k: "7", w: 1 },
    { k: "8", w: 1 }, { k: "9", w: 1 }, { k: "0", w: 1 },
    { k: "-", w: 1 }, { k: "=", w: 1 },
    { k: "delete", w: 1.6, label: "delete", sm: true },
  ],
  [
    { k: "tab", w: 1.4, label: "tab", sm: true },
    { k: "q", w: 1 }, { k: "w", w: 1 }, { k: "e", w: 1 }, { k: "r", w: 1 },
    { k: "t", w: 1 }, { k: "y", w: 1 }, { k: "u", w: 1 }, { k: "i", w: 1 },
    { k: "o", w: 1 }, { k: "p", w: 1 },
    { k: "[", w: 1 }, { k: "]", w: 1 }, { k: "\\", w: 1.2 },
  ],
  [
    { k: "caps", w: 1.6, label: "caps", sm: true },
    { k: "a", w: 1 }, { k: "s", w: 1 }, { k: "d", w: 1 }, { k: "f", w: 1 },
    { k: "g", w: 1 }, { k: "h", w: 1 }, { k: "j", w: 1 }, { k: "k", w: 1 },
    { k: "l", w: 1 }, { k: ";", w: 1 }, { k: "'", w: 1 },
    { k: "enter", w: 2, label: "return", sm: true },
  ],
  [
    { k: "shift", w: 2, label: "shift", sm: true, deco: true },
    { k: "z", w: 1 }, { k: "x", w: 1 }, { k: "c", w: 1 }, { k: "v", w: 1 },
    { k: "b", w: 1 }, { k: "n", w: 1 }, { k: "m", w: 1 },
    { k: ",", w: 1 }, { k: ".", w: 1 }, { k: "/", w: 1 },
    { k: "shift2", w: 2, label: "shift", sm: true, deco: true },
  ],
  [
    { k: "fn", w: 1, label: "fn", sm: true, deco: true },
    { k: "ctrl", w: 1, label: "ctrl", sm: true, deco: true },
    { k: "alt", w: 1, label: "opt", sm: true, deco: true },
    { k: "cmd", w: 1.25, label: "cmd", deco: true },
    { k: " ", w: 5, label: "" },
    { k: "cmd2", w: 1.25, label: "cmd", deco: true },
    { k: "alt2", w: 1, label: "opt", sm: true, deco: true },
    { k: "arrows", w: 3, special: "arrows" },
  ],
];

const SPECIAL = ["delete", "tab", "caps", "enter", "shift", "shift2", "fn", "ctrl", "alt", "alt2", "cmd", "cmd2"];
const BASE_UNIT = 32;
const BASE_GAP = 6;

const MagicKeyboard = ({
  accent = "#3ddcff",
  ghost = null,
  onType,
  onCommand,
  active = true,
  scale = 1,
}: Props) => {
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const unit = BASE_UNIT * scale;
  const gap = BASE_GAP * scale;
  const padding = 12 * scale;
  const keyFont = 10.5 * scale;
  const smallKeyFont = 8 * scale;
  const smallPaddingLeft = 6 * scale;
  const smallPaddingTop = 3 * scale;

  const flash = useCallback((key: string) => {
    setPressed((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    window.setTimeout(() => {
      setPressed((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 220);
  }, []);

  useEffect(() => {
    if (!ghost) return;
    const id = window.requestAnimationFrame(() => {
      flash(ghost.char === " " ? " " : ghost.char.toLowerCase());
    });
    return () => window.cancelAnimationFrame(id);
  }, [ghost, flash]);

  useEffect(() => {
    if (!active) return;

    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return;

      const k = e.key;
      if (k === "Enter") { e.preventDefault(); flash("enter"); onCommand?.("enter"); return; }
      if (k === "Backspace") { e.preventDefault(); flash("delete"); onCommand?.("backspace"); return; }
      if (k === "Tab") { e.preventDefault(); flash("tab"); onCommand?.("tab"); return; }
      if (k === "Escape") { onCommand?.("esc"); return; }
      if (k === "ArrowUp") { e.preventDefault(); flash("arrowup"); onCommand?.("arrowup"); return; }
      if (k === "ArrowDown") { e.preventDefault(); flash("arrowdown"); onCommand?.("arrowdown"); return; }
      if (k === "ArrowLeft") { e.preventDefault(); flash("arrowleft"); onCommand?.("arrowleft"); return; }
      if (k === "ArrowRight") { e.preventDefault(); flash("arrowright"); onCommand?.("arrowright"); return; }
      if (k === " ") { e.preventDefault(); flash(" "); onType?.(" "); return; }
      if (k === "Shift") { flash("shift"); flash("shift2"); return; }

      if (k.length === 1) {
        flash(k.toLowerCase());
        onType?.(k);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, flash, onCommand, onType]);

  const handleClick = (id: string, ch: string) => {
    flash(id);

    if (SPECIAL.includes(id)) {
      if (id === "enter") onCommand?.("enter");
      else if (id === "delete") onCommand?.("backspace");
      else if (id === "tab") onCommand?.("tab");
      return;
    }

    if (id.startsWith("arrow")) {
      onCommand?.(id as Cmd);
      return;
    }

    if (ch === " ") {
      onType?.(" ");
      return;
    }

    if (ch.length === 1) {
      onType?.(ch);
    }
  };

  return (
    <div
      className={styles.root}
      style={{
        ["--accent" as string]: accent,
        padding,
      }}
    >
      <div className={styles.rows} style={{ gap }}>
        {KB_ROWS.map((row, ri) => (
          <div key={ri} className={styles.row} style={{ gap }}>
            {row.map((key, ki) => {
              if (key.special === "arrows") {
                return (
                  <ArrowCluster
                    key={`${ri}-${ki}`}
                    unit={unit}
                    gap={gap}
                    fontSize={smallKeyFont}
                    smallPaddingLeft={smallPaddingLeft}
                    smallPaddingTop={smallPaddingTop}
                    pressed={pressed}
                    onClick={handleClick}
                  />
                );
              }

              return (
                <Keycap
                  key={`${ri}-${ki}`}
                  width={key.w * unit + (key.w - 1) * gap}
                  height={unit}
                  label={key.label !== undefined ? key.label : key.k}
                  smallLabel={key.sm}
                  fontSize={key.sm ? smallKeyFont : keyFont}
                  smallPaddingLeft={smallPaddingLeft}
                  smallPaddingTop={smallPaddingTop}
                  decorative={key.deco}
                  pressed={pressed.has(key.k)}
                  onClick={() => handleClick(key.k, key.k)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

interface KeycapProps {
  width: number;
  height: number;
  label?: string;
  smallLabel?: boolean;
  fontSize: number;
  smallPaddingLeft: number;
  smallPaddingTop: number;
  decorative?: boolean;
  pressed?: boolean;
  onClick?: () => void;
}

const Keycap = ({
  width,
  height,
  label,
  smallLabel,
  fontSize,
  smallPaddingLeft,
  smallPaddingTop,
  decorative,
  pressed,
  onClick,
}: KeycapProps) => {
  const isUpper = !smallLabel && label && label.length === 1 && /[a-z]/i.test(label);
  const display = isUpper ? label!.toUpperCase() : label;

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.keycap}
      data-pressed={pressed || undefined}
      data-deco={decorative || undefined}
      style={{
        width,
        height,
        fontSize,
        letterSpacing: smallLabel ? "0.08em" : 0,
        textTransform: smallLabel ? "uppercase" : "none",
        textAlign: smallLabel ? "left" : "center",
        paddingLeft: smallLabel ? smallPaddingLeft : 0,
        paddingTop: smallLabel ? smallPaddingTop : 0,
        alignItems: smallLabel ? "flex-start" : "center",
        justifyContent: smallLabel ? "flex-start" : "center",
      }}
    >
      {display}
    </button>
  );
};

interface ArrowsProps {
  unit: number;
  gap: number;
  fontSize: number;
  smallPaddingLeft: number;
  smallPaddingTop: number;
  pressed: Set<string>;
  onClick: (id: string, ch: string) => void;
}

const ArrowCluster = ({
  unit,
  gap,
  fontSize,
  smallPaddingLeft,
  smallPaddingTop,
  pressed,
  onClick,
}: ArrowsProps) => {
  const halfHeight = unit / 2 - (2.5 * unit) / BASE_UNIT;
  const clusterGap = Math.max(3, gap - 1);

  return (
    <div className={styles.arrows} style={{ width: unit * 3 + clusterGap * 2, gap: clusterGap }}>
      <div className={styles.arrowsTop} style={{ gap: clusterGap }}>
        <div style={{ width: unit }} />
        <Keycap
          width={unit}
          height={halfHeight}
          label="^"
          smallLabel
          fontSize={fontSize}
          smallPaddingLeft={smallPaddingLeft}
          smallPaddingTop={smallPaddingTop}
          pressed={pressed.has("arrowup")}
          onClick={() => onClick("arrowup", "arrowup")}
        />
        <div style={{ width: unit }} />
      </div>
      <div className={styles.arrowsBottom} style={{ gap: clusterGap }}>
        <Keycap
          width={unit}
          height={halfHeight}
          label="<"
          smallLabel
          fontSize={fontSize}
          smallPaddingLeft={smallPaddingLeft}
          smallPaddingTop={smallPaddingTop}
          pressed={pressed.has("arrowleft")}
          onClick={() => onClick("arrowleft", "arrowleft")}
        />
        <Keycap
          width={unit}
          height={halfHeight}
          label="v"
          smallLabel
          fontSize={fontSize}
          smallPaddingLeft={smallPaddingLeft}
          smallPaddingTop={smallPaddingTop}
          pressed={pressed.has("arrowdown")}
          onClick={() => onClick("arrowdown", "arrowdown")}
        />
        <Keycap
          width={unit}
          height={halfHeight}
          label=">"
          smallLabel
          fontSize={fontSize}
          smallPaddingLeft={smallPaddingLeft}
          smallPaddingTop={smallPaddingTop}
          pressed={pressed.has("arrowright")}
          onClick={() => onClick("arrowright", "arrowright")}
        />
      </div>
    </div>
  );
};

export default MagicKeyboard;
