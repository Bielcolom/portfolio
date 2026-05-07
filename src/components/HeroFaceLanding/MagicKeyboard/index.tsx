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
    { k: "ctrl", w: 1, label: "control", sm: true, deco: true },
    { k: "alt", w: 1, label: "option", sm: true, deco: true },
    { k: "cmd", w: 1.25, label: "⌘", deco: true },
    { k: " ", w: 5, label: "" },
    { k: "cmd2", w: 1.25, label: "⌘", deco: true },
    { k: "alt2", w: 1, label: "option", sm: true, deco: true },
    { k: "arrows", w: 3, special: "arrows" },
  ],
];

const SPECIAL = ["delete", "tab", "caps", "enter", "shift", "shift2", "fn", "ctrl", "alt", "alt2", "cmd", "cmd2"];
const ROW_HUES = [-40, -15, 10, 35, 60];

const UNIT = 32;
const GAP = 6;

const MagicKeyboard = ({ accent = "#3ddcff", onType, onCommand, active = true }: Props) => {
  const [pressed, setPressed] = useState<Set<string>>(new Set());

  const flash = useCallback((key: string) => {
    setPressed((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    setTimeout(() => {
      setPressed((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 220);
  }, []);

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return;
      const k = e.key;
      if (k === "Enter")      { e.preventDefault(); flash("enter");      onCommand?.("enter");      return; }
      if (k === "Backspace")  { e.preventDefault(); flash("delete");     onCommand?.("backspace");  return; }
      if (k === "Tab")        { e.preventDefault(); flash("tab");        onCommand?.("tab");        return; }
      if (k === "Escape")     {                                          onCommand?.("esc");        return; }
      if (k === "ArrowUp")    { e.preventDefault(); flash("arrowup");    onCommand?.("arrowup");    return; }
      if (k === "ArrowDown")  { e.preventDefault(); flash("arrowdown");  onCommand?.("arrowdown");  return; }
      if (k === "ArrowLeft")  { e.preventDefault(); flash("arrowleft");  onCommand?.("arrowleft");  return; }
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
  }, [active, onType, onCommand, flash]);

  const handleClick = (id: string, ch: string) => {
    flash(id);
    if (SPECIAL.includes(id)) {
      if (id === "enter") onCommand?.("enter");
      else if (id === "delete") onCommand?.("backspace");
      else if (id === "tab") onCommand?.("tab");
    } else if (id.startsWith("arrow")) {
      onCommand?.(id as Cmd);
    } else if (ch === " ") {
      onType?.(" ");
    } else if (ch.length === 1) {
      onType?.(ch);
    }
  };

  return (
    <div
      className={styles.root}
      style={{
        ["--accent" as string]: accent,
        border: `1px solid color-mix(in oklch, ${accent} 22%, transparent)`,
        background: `linear-gradient(180deg,
          color-mix(in oklch, ${accent} 5%, transparent) 0%,
          color-mix(in oklch, ${accent} 2%, transparent) 100%)`,
        boxShadow: `
          inset 0 1px 0 color-mix(in oklch, ${accent} 12%, transparent),
          0 0 0 1px rgba(0,0,0,0.4),
          0 18px 40px rgba(0,0,0,0.5)
        `,
      }}
    >
      <div className={styles.rows}>
        {KB_ROWS.map((row, ri) => {
          const rowAccent = `oklch(from ${accent} l c calc(h + ${ROW_HUES[ri] || 0}))`;
          return (
            <div key={ri} className={styles.row}>
              {row.map((key, ki) => {
                if (key.special === "arrows") {
                  return (
                    <ArrowCluster
                      key={`${ri}-${ki}`}
                      accent={rowAccent}
                      pressed={pressed}
                      onClick={handleClick}
                    />
                  );
                }
                return (
                  <Keycap
                    key={`${ri}-${ki}`}
                    width={key.w * UNIT + (key.w - 1) * GAP}
                    height={UNIT}
                    label={key.label !== undefined ? key.label : key.k}
                    smallLabel={key.sm}
                    decorative={key.deco}
                    pressed={pressed.has(key.k)}
                    accent={rowAccent}
                    onClick={() => handleClick(key.k, key.k)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface KeycapProps {
  width: number;
  height: number;
  label?: string;
  smallLabel?: boolean;
  decorative?: boolean;
  pressed?: boolean;
  accent: string;
  onClick?: () => void;
}

const Keycap = ({ width, height, label, smallLabel, decorative, pressed, accent, onClick }: KeycapProps) => {
  const isUpper = !smallLabel && label && label.length === 1 && /[a-z]/i.test(label);
  const display = isUpper ? label!.toUpperCase() : label;

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.keycap}
      style={{
        width, height,
        background: pressed
          ? `color-mix(in oklch, ${accent} 75%, transparent)`
          : `color-mix(in oklch, ${accent} 12%, transparent)`,
        boxShadow: pressed
          ? `0 0 18px color-mix(in oklch, ${accent} 70%, transparent), 0 0 38px color-mix(in oklch, ${accent} 35%, transparent)`
          : `inset 0 0 0 1px color-mix(in oklch, ${accent} 22%, transparent)`,
        color: pressed
          ? "#0a0b0d"
          : decorative
            ? `color-mix(in oklch, ${accent} 55%, white 15%)`
            : `color-mix(in oklch, ${accent} 75%, white 22%)`,
        fontSize: smallLabel ? 8 : 10.5,
        fontWeight: pressed ? 600 : 400,
        letterSpacing: smallLabel ? "0.08em" : 0,
        textTransform: smallLabel ? "uppercase" : "none",
        transform: pressed ? "scale(1.06)" : "scale(1)",
        textAlign: smallLabel ? "left" : "center",
        paddingLeft: smallLabel ? 6 : 0,
        paddingTop: smallLabel ? 3 : 0,
        alignItems: smallLabel ? "flex-start" : "center",
        justifyContent: smallLabel ? "flex-start" : "center",
      }}
    >
      {display}
    </button>
  );
};

interface ArrowsProps {
  accent: string;
  pressed: Set<string>;
  onClick: (id: string, ch: string) => void;
}

const ArrowCluster = ({ accent, pressed, onClick }: ArrowsProps) => {
  const halfH = UNIT / 2 - 2.5;
  return (
    <div className={styles.arrows}>
      <div className={styles.arrowsTop}>
        <div style={{ width: UNIT }} />
        <Keycap width={UNIT} height={halfH} label="▲" smallLabel pressed={pressed.has("arrowup")} accent={accent}
          onClick={() => onClick("arrowup", "arrowup")} />
        <div style={{ width: UNIT }} />
      </div>
      <div className={styles.arrowsBottom}>
        <Keycap width={UNIT} height={halfH} label="◀" smallLabel pressed={pressed.has("arrowleft")} accent={accent}
          onClick={() => onClick("arrowleft", "arrowleft")} />
        <Keycap width={UNIT} height={halfH} label="▼" smallLabel pressed={pressed.has("arrowdown")} accent={accent}
          onClick={() => onClick("arrowdown", "arrowdown")} />
        <Keycap width={UNIT} height={halfH} label="▶" smallLabel pressed={pressed.has("arrowright")} accent={accent}
          onClick={() => onClick("arrowright", "arrowright")} />
      </div>
    </div>
  );
};

export default MagicKeyboard;
