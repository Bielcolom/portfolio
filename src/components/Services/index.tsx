"use client";
import { useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef } from "react";
import ArrowIcon from "@/components/ArrowIcon";
import Availability from "@/components/Availability";
import { openDraft } from "@/components/Contact";
import Magnetic from "@/components/Magnetic";
import Reveal from "@/components/Reveal";
import { jumpTo } from "@/components/SmoothScroll";
import TextRoll from "@/components/TextRoll";
import { FINE_POINTER, mailto } from "@/content/links";
import { PAGE_PATH } from "@/content/site";
import { useLanguage } from "@/i18n/context";
import Faq from "./Faq";
import Offers from "./Offers";
import Process from "./Process";
import styles from "./services.module.scss";

/** One masked span per word, risen by CSS on load: the headline is the page's
    largest paint, so it never waits for the client */
const Headline = ({ id, text }: { id: string; text: string }) => {
  const words = text.split(" ");
  return (
    <h1 id={id} className={styles.title}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className={styles.word}>
            <span className={styles.wordInner}>{word}</span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </h1>
  );
};

/**
 * What a business owner needs in the first view: what he builds, where, a
 * way to ask for a quote, and the person they would be working with.
 */
const Intro = () => {
  const { locale, t } = useLanguage();

  /* Phones hand the draft to the mail app. On a computer mailto often leads
     nowhere, so the page changes to the contact block with the project's
     options already open: Gmail, Outlook, the mail app or the address */
  const askQuote = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const contact = document.getElementById("contact");
    if (!contact || !window.matchMedia(FINE_POINTER).matches) return;
    e.preventDefault();
    jumpTo(contact, () => openDraft("project"));
  };

  return (
    <section id="top" className={styles.intro} aria-labelledby="services-title">
      <Headline id="services-title" text={t.services.title} />

      <div className={styles.lower}>
        <div className={styles.copy}>
          <p className={styles.lede}>{t.services.lede}</p>
          <div className={styles.actions}>
            <Magnetic>
              <a href={mailto(t.contact.intents[1])} className={styles.primary} onClick={askQuote}>
                <TextRoll text={t.services.cta} />
              </a>
            </Magnetic>
            <Magnetic>
              <Link href={`${PAGE_PATH.home[locale]}#experience`} className={styles.secondary}>
                <TextRoll text={t.services.work} />
              </Link>
            </Magnetic>
          </div>
          <p className={styles.note}>{t.services.ctaNote}</p>
        </div>

        <div className={styles.side}>
          <figure className={styles.portrait}>
            <Image
              src="/hero-last.jpg"
              alt={t.services.portraitAlt}
              fill
              sizes="(max-width: 900px) 120px, 220px"
              className={styles.photo}
              loading="eager"
            />
          </figure>
          <Availability variant="projects" />
        </div>
      </div>
    </section>
  );
};

/** Things already built, as plain claims: each one is on the home page or in the CV */
const Proof = () => {
  const { locale, t } = useLanguage();
  const ref = useRef<HTMLUListElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <section id="proof" className={styles.proof} aria-labelledby="proof-title">
      <Reveal as="h2" id="proof-title" text={t.services.proofTitle} className={styles.sectionTitle} />
      <ul ref={ref} className={styles.proofList} data-visible={visible || undefined}>
        {t.services.proof.map((item, i) => (
          <li key={i} className={styles.proofItem}>
            <span className={styles.proofText}>{item}</span>
          </li>
        ))}
      </ul>
      <Link href={`${PAGE_PATH.home[locale]}#experience`} className={styles.more}>
        <TextRoll text={t.services.work} />
        <ArrowIcon className={styles.moreArrow} />
      </Link>
    </section>
  );
};

/** The services page: offer, kinds of work, how a project runs, proof and answers */
const Services = () => (
  <>
    <Intro />
    <Offers />
    <Process />
    <Proof />
    <Faq />
  </>
);

export default Services;
