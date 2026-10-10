"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/Reveal";
import { useLanguage } from "@/i18n/context";
import { ServiceOffer } from "@/i18n/translations";
import styles from "./offers.module.scss";

const Row = ({ offer }: { offer: ServiceOffer }) => {
  const ref = useRef<HTMLLIElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  return (
    <li ref={ref} className={styles.row} data-visible={visible || undefined}>
      <span className={styles.rule} aria-hidden />
      <h3 className={styles.name}>
        <span className={styles.nameInner}>{offer.title}</span>
      </h3>
      <div className={styles.body}>
        <p className={styles.desc}>{offer.body}</p>
        <ul className={styles.includes}>
          {offer.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </li>
  );
};

/** The four kinds of work, set in the projects' grammar: a hairline draws,
    the name rises at display size, then what it covers */
const Offers = () => {
  const { t } = useLanguage();

  return (
    <section id="offers" className={styles.offers} aria-labelledby="offers-title">
      <Reveal as="h2" id="offers-title" text={t.services.offersTitle} className={styles.title} />
      <ol className={styles.list}>
        {t.services.offers.map((offer, i) => (
          <Row key={i} offer={offer} />
        ))}
      </ol>
    </section>
  );
};

export default Offers;
