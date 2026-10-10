"use client";
import { MotionValue, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Fragment, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { scrollToTarget } from "@/components/SmoothScroll";
import { useLanguage } from "@/i18n/context";
import ChapterArt from "./ChapterArt";
import { CHAPTER_COUNT, activeChapter, chapterAnchor } from "./chapters";
import styles from "./story.module.scss";

const RailFill = ({ progress, index }: { progress: MotionValue<number>; index: number }) => {
  const transform = useTransform(progress, (p) => {
    const fill = Math.min(1, Math.max(0, p * CHAPTER_COUNT - index));
    return `scaleX(${fill})`;
  });
  return <motion.span className={styles.railFill} style={{ transform }} />;
};

/**
 * What he does, in four chapters while the screen holds still: capabilities,
 * not a job history (the CV carries that). The text takes the left of the
 * pinned view and the particles form its object on the right: a three-layer
 * stack, the assistant, two devices, a payment card. The rail below jumps
 * straight to a chapter.
 */
const Story = () => {
  const { t } = useLanguage();
  const xp = t.experience;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => setActive(activeChapter(p)));

  const jump = (index: number) => {
    const section = ref.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    scrollToTarget(top + chapterAnchor(index) * (section.offsetHeight - window.innerHeight));
  };

  return (
    <section
      id="experience"
      ref={ref}
      className={styles.story}
      data-particles="story"
      aria-labelledby="experience-title"
    >
      <div className={styles.pin}>
        <header className={styles.head}>
          <Reveal as="h2" id="experience-title" text={xp.title} className={styles.title} />
          <p className={styles.lede}>{xp.lede}</p>
        </header>

        <div className={styles.chapters}>
          {xp.chapters.map((chapter, i) => (
            <article
              key={chapter.title}
              className={styles.chapter}
              data-active={i === active || undefined}
              aria-labelledby={`chapter-${i}`}
            >
              <h3 id={`chapter-${i}`} className={styles.chapterTitle}>
                {chapter.title.split(" ").map((word, w, all) => (
                  <Fragment key={w}>
                    <span className={styles.word}>
                      <span className={styles.wordInner}>{word}</span>
                    </span>
                    {w < all.length - 1 && " "}
                  </Fragment>
                ))}
              </h3>
              <p className={styles.body}>{chapter.body}</p>
              {i === xp.chapters.length - 1 && <p className={styles.also}>{xp.also}</p>}
              <ul className={styles.tags}>
                {chapter.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className={styles.rail}>
          {xp.chapters.map((chapter, i) => (
            <button
              key={chapter.title}
              type="button"
              className={styles.railItem}
              data-active={i === active || undefined}
              aria-current={i === active ? "step" : undefined}
              onClick={() => jump(i)}
            >
              <span className={styles.railTrack} aria-hidden>
                <RailFill progress={scrollYProgress} index={i} />
              </span>
              <span className={styles.railLabel}>{chapter.title}</span>
              <span className={styles.srOnly}>
                {xp.step.replace("{n}", String(i + 1)).replace("{total}", String(CHAPTER_COUNT))}
              </span>
            </button>
          ))}
        </div>

        <div
          className={styles.stage}
          data-particles="stage"
          data-particles-drag
          data-cursor="drag"
          data-cursor-label={t.cursor.drag}
          aria-hidden
        >
          <ChapterArt active={active} />
          <span className={styles.hint}>{xp.drag}</span>
        </div>
      </div>
    </section>
  );
};

export default Story;
