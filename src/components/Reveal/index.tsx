"use client";
import { useInView } from "framer-motion";
import { Fragment, useRef } from "react";
import styles from "./reveal.module.scss";

interface Props {
  text: string;
  as?: "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  id?: string;
  /** Holds the first word back, for a line that follows another */
  delay?: "none" | "short" | "long";
}

/**
 * Words rise out of their own masks, one after another, the first time the
 * block scrolls into view. Without the client the text simply stands.
 */
const Reveal = ({ text, as = "p", className, id, delay = "none" }: Props) => {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  // Asserted, not annotated: an annotation narrows back to the tag union,
  // whose ref types do not agree with each other
  const Tag = as as React.ElementType;
  const words = text.split(" ");

  return (
    <Tag
      ref={ref}
      id={id}
      className={className ? `${styles.root} ${className}` : styles.root}
      data-visible={visible || undefined}
      data-delay={delay}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className={styles.word}>
            <span className={styles.inner}>{word}</span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
};

export default Reveal;
