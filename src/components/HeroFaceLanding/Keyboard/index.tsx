import React from "react";
import styles from "./keyboard.module.scss";

interface KeyboardProps {
  /** Cantidad de teclas por fila. Ej: [13,12,12] */
  rows?: number[];
  /** Espacio vertical entre filas (px) */
  rowGap?: number;
  /** Padding superior e inferior (px) */
  verticalPadding?: number;
  /** Distancia horizontal entre teclas */
  keyStepX?: number;
  /** Offset X de la primera fila */
  firstRowOffsetX?: number;
  /** Offset alterno para filas pares (stagger) */
  staggerOffsetX?: number;
  /** Ancho máximo del plate (para centrar) */
  plateWidth?: number;
  /** Retraso base para animaciones breathing */
  baseDelayMs?: number;
}

export default function Keyboard({
  rows = [13, 12, 12],
  rowGap = 30,
  verticalPadding = 14,
  keyStepX = 48,
  firstRowOffsetX = 18,
  staggerOffsetX = 24,
  plateWidth = 640,
  baseDelayMs = 110,
}: KeyboardProps) {
  const keyWidth = 36;
  const keyHeight = 20;
  const rowCount = rows.length;
  const plateHeight = verticalPadding + (rowCount - 1) * rowGap + keyHeight + verticalPadding;
  const viewBoxHeight = plateHeight;

  return (
    <div className={styles.root} aria-hidden>
      <svg viewBox={`0 0 ${plateWidth} ${viewBoxHeight}`} className={styles.keyboardSvg}>
        <defs>
          <linearGradient id="plate" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#16181c" />
            <stop offset="100%" stopColor="#0c0d10" />
          </linearGradient>
        </defs>
        <rect width={plateWidth} height={plateHeight} rx={14} className={styles.plate} />
        {rows.map((cols, rowIdx) => {
          const y = verticalPadding + rowIdx * rowGap;
          const offsetX = rowIdx % 2 === 0 ? firstRowOffsetX : firstRowOffsetX + staggerOffsetX;
          return Array.from({ length: cols }).map((_, i) => {
            const x = offsetX + i * keyStepX;
            const animDelay = rowIdx * 400 + i * baseDelayMs;
            return (
              <g key={`r${rowIdx}-${i}`} transform={`translate(${x},${y})`}>
                <rect
                  width={keyWidth}
                  height={keyHeight}
                  className={`${styles.keycap} ${styles.keycapAnimated}`}
                  style={{ animationDelay: `${animDelay}ms` }}
                />
                <rect width={keyWidth} height={keyHeight} className={styles.keyGlow} />
              </g>
            );
          });
        })}
      </svg>
    </div>
  );
}
