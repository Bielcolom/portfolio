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
  durationMs = 2400, // transición más lenta (antes 1800)
  monitorWidthVW = 46, // tamaño del monitor (responsive) reducido para dejar espacio al título
  startScale = 1.4, // escala inicial (más cerca)
  startZ = 170, // z inicial (más cerca de cámara)
}: {
  mediaSrc?: string;
  durationMs?: number;
  monitorWidthVW?: number;
  startScale?: number;
  startZ?: number;
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

  useEffect(() => {
    // Pausa el vídeo al terminar la animación principal (faseEnd)
    if (isVideo && screenMedia.current instanceof HTMLVideoElement) {
      const v = screenMedia.current;
      const timeoutId = window.setTimeout(() => {
        try {
          if (!v.paused) v.pause();
        } catch {}
      }, phaseEnd);
      return () => clearTimeout(timeoutId);
    }
  }, [isVideo, phaseEnd]);

  // Detecta pantalla pequeña para suavizar animación problemática en móviles
  const isSmallScreen = typeof window !== 'undefined' && window.matchMedia('(max-width: 680px)').matches;

  return (
    <div className={styles.container}>
      {/* Monitor + teclado + CTA en columna */}
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 1, scale: 1, rotateX: 0 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0 }}
      >
        <div
          className={styles.monitorWrapper}
          style={{
            // En desktop mantiene el ancho basado en vw, en móviles asegura mínimo legible
            width: `clamp(300px, ${monitorWidthVW}vw, 860px)`,
          }}
        >
          <Monitor durationMs={durationMs} reducedMotion={reduced}>
            {/* Ventana de pantalla del monitor (clip del media) */}
            <div className={styles.screenWindow}>
              <motion.div
                className={styles.screenInner}
                initial={
                  reduced || isSmallScreen
                    ? { scale: 1 }
                    : { scale: startScale, z: startZ, filter: 'brightness(1.08)' }
                }
                animate={
                  reduced || isSmallScreen
                    ? { scale: 1 }
                    : { scale: 1, z: 0, filter: 'brightness(1)' }
                }
                transition={
                  reduced || isSmallScreen
                    ? { duration: 0 }
                    : {
                        duration: phaseEnd / 1000,
                        ease: [0.16, 0.84, 0.39, 1],
                        filter: { duration: phaseEnd / 1300 },
                      }
                }
              >
                {isVideo ? (
                  <video
                    ref={setVideoRef}
                    className={styles.media}
                    src={mediaSrc}
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
          {/* Espacio para teclado */}
          <div style={{ marginTop: "34px" }}>
            <KeyBoard />
          </div>
        </div>
        {/* CTA ahora justo debajo del teclado */}
        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reduced || isSmallScreen ? 0.15 : phaseEnd / 2000,
            duration: 0.45,
            ease: 'easeOut',
          }}
        >
          <h1 className={styles.title}>Hola, soy Biel — Full‑stack dev</h1>
        </motion.div>
      </motion.div>
    </div>
  );
}

// MonitorWithKeyboard extraído a su propio componente.

