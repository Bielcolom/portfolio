/**
 * MagicKeyboard — interactive keyboard visualization.
 * Renders a Spanish ISO layout (Cherry KC 1000 SC, minus the function row and
 * the Windows keys) that both reflects physical keydown events and is clickable
 * (touch/mouse). Delegates typed characters and commands to the parent via
 * onType / onCommand props.
 */
"use client";
import { CSSProperties, useCallback, useEffect, useState } from "react";
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
  deco?: boolean;
  /** Symbol legend — printed larger than a letter, as on the physical board. */
  glyph?: boolean;
  /** Word legend too long for its cap at the normal size. */
  small?: boolean;
  /** Rendered outside the row flow — the row only reserves the width. */
  special?: "isoEnter";
}

/** Every row sums to 15u, the ISO width. */
const KB_ROWS: Key[][] = [
  [
    { k: "º", w: 1 }, { k: "1", w: 1 }, { k: "2", w: 1 }, { k: "3", w: 1 },
    { k: "4", w: 1 }, { k: "5", w: 1 }, { k: "6", w: 1 }, { k: "7", w: 1 },
    { k: "8", w: 1 }, { k: "9", w: 1 }, { k: "0", w: 1 },
    { k: "'", w: 1 }, { k: "¡", w: 1 },
    { k: "delete", w: 2, label: "⇦", glyph: true },
  ],
  [
    { k: "tab", w: 1.5, label: "⇄", glyph: true },
    { k: "q", w: 1 }, { k: "w", w: 1 }, { k: "e", w: 1 }, { k: "r", w: 1 },
    { k: "t", w: 1 }, { k: "y", w: 1 }, { k: "u", w: 1 }, { k: "i", w: 1 },
    { k: "o", w: 1 }, { k: "p", w: 1 },
    { k: "`", w: 1 }, { k: "+", w: 1 },
    { k: "enter", w: 1.5, special: "isoEnter" },
  ],
  [
    { k: "caps", w: 1.75, label: "mayús", deco: true },
    { k: "a", w: 1 }, { k: "s", w: 1 }, { k: "d", w: 1 }, { k: "f", w: 1 },
    { k: "g", w: 1 }, { k: "h", w: 1 }, { k: "j", w: 1 }, { k: "k", w: 1 },
    { k: "l", w: 1 }, { k: "ñ", w: 1 },
    { k: "´", w: 1 }, { k: "ç", w: 1 },
    { k: "enter", w: 1.25, special: "isoEnter" },
  ],
  [
    { k: "shift", w: 1.25, label: "⇧", deco: true, glyph: true },
    { k: "<", w: 1 },
    { k: "z", w: 1 }, { k: "x", w: 1 }, { k: "c", w: 1 }, { k: "v", w: 1 },
    { k: "b", w: 1 }, { k: "n", w: 1 }, { k: "m", w: 1 },
    { k: ",", w: 1 }, { k: ".", w: 1 }, { k: "-", w: 1 },
    { k: "shift2", w: 2.75, label: "⇧", deco: true, glyph: true },
  ],
  [
    // The two Windows keys are dropped; their width goes to the modifiers so the
    // space bar keeps its true 6.25u proportion.
    { k: "ctrl", w: 1.75, label: "control", deco: true },
    { k: "alt", w: 1.75, label: "alt", deco: true },
    { k: " ", w: 6.25, label: "" },
    { k: "altgr", w: 1.75, label: "alt gr", deco: true },
    { k: "menu", w: 1.75, label: "▤", deco: true, glyph: true },
    { k: "ctrl2", w: 1.75, label: "control", deco: true },
  ],
];

/** Nav cluster, 3u wide. Its two word rows line up with the number and QWERTY rows. */
const NAV_ROWS = [
  [{ k: "insert", label: "insert" }, { k: "home", label: "inicio" }, { k: "pageup", label: "re pág" }],
  [{ k: "supr", label: "supr" }, { k: "end", label: "fin" }, { k: "pagedown", label: "av pág" }],
];

const BOTTOM_ARROWS = [
  { id: "arrowleft", glyph: "←" },
  { id: "arrowdown", glyph: "↓" },
  { id: "arrowright", glyph: "→" },
];

const SPECIAL = ["delete", "tab", "caps", "enter", "shift", "shift2", "ctrl", "ctrl2", "alt", "altgr", "menu",
  "insert", "home", "pageup", "supr", "end", "pagedown"];

/** Physical keys that only light their cap: no command, no character. */
const PASSIVE_KEYS: Record<string, string[]> = {
  CapsLock: ["caps"],
  Shift: ["shift", "shift2"],
  Control: ["ctrl", "ctrl2"],
  Alt: ["alt"],
  AltGraph: ["altgr"],
  ContextMenu: ["menu"],
  Insert: ["insert"],
  Delete: ["supr"],
  Home: ["home"],
  End: ["end"],
  PageUp: ["pageup"],
  PageDown: ["pagedown"],
};
const BASE_UNIT = 32;
const BASE_GAP = 6;
/** Matches the keycap border-radius in the stylesheet. */
const KEY_RADIUS = 5;

/** Offset of a key that follows `units` of keys, gaps included. */
const offsetAt = (units: number, unit: number, gap: number) => units * (unit + gap);
const keyWidth = (w: number, unit: number, gap: number) => w * unit + (w - 1) * gap;

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
  const glyphFont = 17 * scale;
  const smallFont = 8.2 * scale;

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
      const k = e.key;

      // Ahead of the modifier guard: control itself arrives with ctrlKey set,
      // and Windows reports AltGr as control + AltGraph
      const passive = PASSIVE_KEYS[k];
      if (passive) { passive.forEach(flash); return; }

      if (e.metaKey || e.ctrlKey) return;
      if (k === "Enter") { e.preventDefault(); flash("enter"); onCommand?.("enter"); return; }
      if (k === "Backspace") { e.preventDefault(); flash("delete"); onCommand?.("backspace"); return; }
      if (k === "Tab") { e.preventDefault(); flash("tab"); onCommand?.("tab"); return; }
      if (k === "Escape") { onCommand?.("esc"); return; }
      if (k === "ArrowUp") { e.preventDefault(); flash("arrowup"); onCommand?.("arrowup"); return; }
      if (k === "ArrowDown") { e.preventDefault(); flash("arrowdown"); onCommand?.("arrowdown"); return; }
      if (k === "ArrowLeft") { e.preventDefault(); flash("arrowleft"); onCommand?.("arrowleft"); return; }
      if (k === "ArrowRight") { e.preventDefault(); flash("arrowright"); onCommand?.("arrowright"); return; }
      if (k === " ") { e.preventDefault(); flash(" "); onType?.(" "); return; }

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
        // The nav cluster sits a quarter unit clear of the main block
        gap: offsetAt(0.25, unit, gap),
      }}
    >
      <div className={styles.rows} style={{ gap }}>
        {KB_ROWS.map((row, ri) => (
          <div key={ri} className={styles.row} style={{ gap }}>
            {row.map((key, ki) => {
              if (key.special === "isoEnter") {
                return <div key={`${ri}-${ki}`} style={{ width: keyWidth(key.w, unit, gap) }} />;
              }

              return (
                <Keycap
                  key={`${ri}-${ki}`}
                  width={keyWidth(key.w, unit, gap)}
                  height={unit}
                  label={key.label !== undefined ? key.label : key.k}
                  fontSize={key.glyph ? glyphFont : key.small ? smallFont : keyFont}
                  decorative={key.deco}
                  pressed={pressed.has(key.k)}
                  onClick={() => handleClick(key.k, key.k)}
                />
              );
            })}
          </div>
        ))}

        <IsoEnter
          unit={unit}
          gap={gap}
          fontSize={glyphFont}
          pressed={pressed.has("enter")}
          onClick={() => handleClick("enter", "enter")}
        />
      </div>

      <NavCluster
        unit={unit}
        gap={gap}
        glyphFont={glyphFont}
        smallFont={smallFont}
        pressed={pressed}
        onClick={handleClick}
      />
    </div>
  );
};

interface KeycapProps {
  width: number;
  height: number;
  label?: string;
  fontSize: number;
  decorative?: boolean;
  pressed?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

const Keycap = ({
  width,
  height,
  label,
  fontSize,
  decorative,
  pressed,
  onClick,
  className,
  style,
}: KeycapProps) => {
  const isLetter = label && label.length === 1 && /[a-z]/i.test(label);
  const display = isLetter ? label.toUpperCase() : label;

  return (
    <button
      type="button"
      onClick={onClick}
      className={className ? `${styles.keycap} ${className}` : styles.keycap}
      data-pressed={pressed || undefined}
      data-deco={decorative || undefined}
      style={{ width, height, fontSize, ...style }}
    >
      {display}
    </button>
  );
};

type Point = [number, number];

/** Moves `from` towards `to` by at most r, capped at half the edge. */
const inset = ([x, y]: Point, [tx, ty]: Point, r: number): Point => {
  const dx = tx - x;
  const dy = ty - y;
  const len = Math.hypot(dx, dy) || 1;
  const k = Math.min(r, len / 2) / len;
  return [x + dx * k, y + dy * k];
};

/**
 * SVG path for a polygon with rounded corners. Quadratics anchored on the
 * vertex round convex and concave corners alike, which the ISO enter needs.
 */
const roundedPolygon = (pts: Point[], r: number) => {
  const n = pts.length;
  let d = "";

  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const [sx, sy] = inset(cur, pts[(i - 1 + n) % n], r);
    const [ex, ey] = inset(cur, pts[(i + 1) % n], r);
    d += `${i === 0 ? "M" : "L"} ${sx} ${sy} Q ${cur[0]} ${cur[1]} ${ex} ${ey} `;
  }

  return `${d}Z`;
};

interface IsoEnterProps {
  unit: number;
  gap: number;
  fontSize: number;
  pressed: boolean;
  onClick: () => void;
}

/**
 * The ISO enter spans rows 2 and 3, so it sits absolutely over them while those
 * rows reserve its width. Its L shape comes from clip-path, which drops the
 * border-radius and the outer shadow — the stylesheet restores both.
 */
const IsoEnter = ({ unit, gap, fontSize, pressed, onClick }: IsoEnterProps) => {
  const width = keyWidth(1.5, unit, gap);
  const height = 2 * unit + gap;
  // Row 3 starts 0.25u further right than row 2 — that step is the notch
  const notchX = offsetAt(0.25, unit, gap);
  const notchY = unit + gap;

  const path = roundedPolygon(
    [[0, 0], [width, 0], [width, height], [notchX, height], [notchX, notchY], [0, notchY]],
    KEY_RADIUS,
  );

  return (
    <Keycap
      width={width}
      height={height}
      label="↵"
      fontSize={fontSize}
      pressed={pressed}
      onClick={onClick}
      className={styles.isoEnter}
      style={{
        top: unit + gap,
        clipPath: `path("${path}")`,
        // Centres the glyph in the upper arm rather than in the bounding box
        paddingBottom: notchY,
      }}
    />
  );
};

interface NavProps {
  unit: number;
  gap: number;
  glyphFont: number;
  smallFont: number;
  pressed: Set<string>;
  onClick: (id: string, ch: string) => void;
}

/**
 * The 3u navigation block that sits right of the main rows: two word rows, a
 * blank band, then the inverted-T arrows. Its five bands line up one-to-one
 * with the five keyboard rows, so the case has no dead corner.
 */
const NavCluster = ({
  unit,
  gap,
  glyphFont,
  smallFont,
  pressed,
  onClick,
}: NavProps) => (
  <div className={styles.nav} style={{ width: keyWidth(3, unit, gap), gap }}>
    {NAV_ROWS.map((row, ri) => (
      <div key={ri} className={styles.navRow} style={{ gap }}>
        {row.map(({ k, label }) => (
          <Keycap
            key={k}
            width={unit}
            height={unit}
            label={label}
            fontSize={smallFont}
            decorative
            pressed={pressed.has(k)}
            onClick={() => onClick(k, k)}
          />
        ))}
      </div>
    ))}

    {/* Blank band opposite the home row, as on the physical board */}
    <div style={{ height: unit }} />

    <div className={styles.navRow} style={{ gap }}>
      <div style={{ width: unit }} />
      <Keycap
        width={unit}
        height={unit}
        label="↑"
        fontSize={glyphFont}
        pressed={pressed.has("arrowup")}
        onClick={() => onClick("arrowup", "arrowup")}
      />
      <div style={{ width: unit }} />
    </div>

    <div className={styles.navRow} style={{ gap }}>
      {BOTTOM_ARROWS.map(({ id, glyph }) => (
        <Keycap
          key={id}
          width={unit}
          height={unit}
          label={glyph}
          fontSize={glyphFont}
          pressed={pressed.has(id)}
          onClick={() => onClick(id, id)}
        />
      ))}
    </div>
  </div>
);

export default MagicKeyboard;
