"use client";
import Reveal from "@/components/Reveal";
import { useLanguage } from "@/i18n/context";
import styles from "./faq.module.scss";

/** Open answers, not an accordion: six short ones read faster than six clicks,
    and they are the same answers the structured data gives */
const Faq = () => {
  const { t } = useLanguage();

  return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-title">
      <Reveal as="h2" id="faq-title" text={t.services.faqTitle} className={styles.title} />
      <dl className={styles.list}>
        {t.services.faqs.map((faq, i) => (
          <div key={i} className={styles.item}>
            <dt className={styles.question}>{faq.q}</dt>
            <dd className={styles.answer}>{faq.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default Faq;
