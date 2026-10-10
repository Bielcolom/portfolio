"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Availability from "@/components/Availability";
import Magnetic from "@/components/Magnetic";
import TextRoll from "@/components/TextRoll";
import { jumpTo } from "@/components/SmoothScroll";
import { FINE_POINTER, mailto } from "@/content/links";
import { useLanguage } from "@/i18n/context";
import styles from "./hero.module.scss";
import { useTextPressure } from "./useTextPressure";

const NAME_LINES = ["Gabriel", "Colom Moll"];

/** The name, one span per letter: each rises out of its line's mask on load */
const NameLine = ({ text, className }: { text: string; className: string }) => (
  <span className={className}>
    <span className={styles.mask}>
      {[...text].map((ch, i) =>
        ch === " "
          ? <span key={i} className={styles.space} />
          : <span key={i} className={styles.char} data-char>{ch}</span>,
      )}
    </span>
  </span>
);

/**
 * First viewport. The name is set across the page in two lines; the portrait
 * stands between them, the first line behind it and the second crossing in
 * front. The clip plays once: he crosses his arms and smiles, and that last
 * frame is what the particles below are made from.
 */
const Hero = () => {
  const { locale, t } = useLanguage();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useTextPressure(sectionRef, nameRef);

  /* Played from script, not autoplay: React does not render `muted` into the
     server HTML, and some browsers then refuse to start the clip */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce !== false) return;
    video.muted = true;
    video.play().catch(() => setBlocked(true));
  }, [reduce]);

  const still = reduce === true || blocked;

  /* On a computer, mailto often leads nowhere: "Email me" changes page to the
     contact block instead, where Gmail, Outlook and the mail app are offered */
  const writeTo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const contact = document.getElementById("contact");
    if (!contact || !window.matchMedia(FINE_POINTER).matches) return;
    e.preventDefault();
    jumpTo(contact);
  };

  /* Leaving the hero, the two lines of the name part ways */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const lineA = useTransform(scrollYProgress, (p) => `translate3d(${-p * 16}vw, 0, 0)`);
  const lineB = useTransform(scrollYProgress, (p) => `translate3d(${p * 16}vw, 0, 0)`);
  const footFade = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className={styles.hero}
      data-particles="hero"
      aria-labelledby="hero-name"
    >
      <h1 id="hero-name" className={styles.srOnly}>
        Gabriel Colom Moll, {t.meta.role.toLowerCase()}
      </h1>

      <div ref={nameRef} className={styles.name} data-cursor="lens" aria-hidden>
        <motion.div className={styles.lineA} style={{ transform: reduce ? undefined : lineA }}>
          <NameLine text={NAME_LINES[0]} className={styles.line} />
        </motion.div>
        <motion.div className={styles.lineB} style={{ transform: reduce ? undefined : lineB }}>
          <NameLine text={NAME_LINES[1]} className={styles.line} />
        </motion.div>
      </div>

      <div className={styles.portrait} data-particles="portrait">
        <div className={styles.frame}>
          <video
            ref={videoRef}
            className={styles.video}
            muted
            playsInline
            preload={reduce ? "none" : "auto"}
            poster="/hero-first.jpg"
            aria-hidden
          >
            <source src="/hero-sm.mp4" type="video/mp4" media="(max-width: 600px)" />
            <source src="/hero-lg.mp4" type="video/mp4" />
          </video>
          {still && (
            <Image
              src="/hero-last.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 64vw, 30vw"
              className={styles.video}
              priority
            />
          )}
        </div>
      </div>

      <motion.div className={styles.foot} style={{ opacity: footFade }}>
        <div className={styles.intro}>
          <p className={styles.role}>
            {t.meta.role} <span className={styles.dot} aria-hidden /> {t.meta.location}
          </p>
          <p className={styles.pitch}>{t.hero.pitch}</p>
          <div className={styles.actions}>
            <Magnetic>
              <a
                href={t.cv.href}
                hrefLang={locale}
                type="application/pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primary}
              >
                <TextRoll text={t.hero.cv} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={mailto(t.mail)} className={styles.secondary} onClick={writeTo}>
                <TextRoll text={t.hero.email} />
              </a>
            </Magnetic>
          </div>
        </div>

        <div className={styles.side}>
          <Availability />
          <span className={styles.cue} aria-hidden>
            {t.hero.scroll}
            <span className={styles.cueLine} />
          </span>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
