"use client";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import styles from "./heroFaceLanding.module.scss"; // <-- Sass (CSS Modules)
import Monitor from "./Monitor";
import KeyBoard from "./Keyboard";

/**
 * HeroFaceLanding (Sass version, no Tailwind)
 *
 * Qué hace
 *  - Al cargar: pantalla negra → aumenta la luminancia del media (vídeo o foto)
 *  - Efecto de alejamiento (dolly-out) mientras aparece un monitor con teclado
 *  - Termina con la cara encapsulada dentro del monitor
 *
 * Requisitos
 *  - npm i framer-motion sass
 *  - Coloca /face.mp4 o /face.jpg en /public
 */
export default function HeroFaceLanding({
  mediaSrc = "/face.mp4", // o "/face.jpg"
  durationMs = 1800, // más rápido
  monitorWidthVW = 52, // tamaño del monitor (responsive)
}: {
  mediaSrc?: string;
  durationMs?: number;
  monitorWidthVW?: number;
}) {
  const isVideo = mediaSrc.toLowerCase().endsWith(".mp4");
  // Solo una transición: cara grande -> cara encaja dentro del monitor.
  const phaseEnd = durationMs; // fin de la animación (shrink total)

  const reduced = useReducedMotion();
  const screenMedia = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  // Typed callback refs to avoid `any` casts when assigning conditionally to video or image
  const setVideoRef = (node: HTMLVideoElement | null) => {
    screenMedia.current = node;
  };
  const setImageRef = (node: HTMLImageElement | null) => {
    screenMedia.current = node;
  };

  useEffect(() => {
    // Reproducción del video sin animaciones compuestas.
    if (isVideo && screenMedia.current instanceof HTMLVideoElement) {
      const v = screenMedia.current;
      v.muted = true;
      v.playsInline = true;
      v.autoplay = true;
      void v.play().catch(() => {});
    }
  }, [isVideo]);

  return (
    <div className={styles.container}>
      {/* Monitor + teclado único con el video/foto */}
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 1, scale: 1, rotateX: 0 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0 }}
      >
        <div className={styles.monitorWrapper} style={{ width: `${monitorWidthVW}vw` }}>
          <Monitor durationMs={durationMs} reducedMotion={reduced}>
            {/* Ventana de pantalla del monitor (clip del media) */}
            <div className={styles.screenWindow}>
              <motion.div
                className={styles.screenInner}
                initial={reduced ? false : { scale: 1.35, z: 160, filter: 'blur(3px) brightness(1.08)' }}
                animate={reduced ? { scale: 1 } : { scale: 1, z: 0, filter: 'blur(0px) brightness(1)' }}
                transition={{
                  duration: phaseEnd / 1000,
                  ease: [0.16, 0.84, 0.39, 1],
                  filter: { duration: phaseEnd / 1400 },
                }}
              >
                {isVideo ? (
                  <video
                    ref={setVideoRef}
                    className={styles.media}
                    src={mediaSrc}
                    loop
                    muted
                    playsInline
                    autoPlay
                    preload="metadata"
                  />
                ) : (
                  <Image
                    ref={setImageRef}
                    src={mediaSrc}
                    alt="Tu rostro en monitor"
                    fill
                    sizes="84vw"
                    className={styles.media}
                    priority
                  />
                )}
              </motion.div>
            </div>
          </Monitor>
          {/* Separación aumentada para compensar nuevo pie del monitor */}
          <div style={{ marginTop: "42px" }}>
            <KeyBoard />
          </div>
        </div>
      </motion.div>

      {/* CTA opcional al final de la secuencia */}
      <motion.div
        className={styles.cta}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: phaseEnd / 1200, duration: 0.6 }}
      >
        <h1 className={styles.title}>Hola, soy Biel — Full‑stack dev</h1>
      </motion.div>
    </div>
  );
}

// MonitorWithKeyboard extraído a su propio componente.

