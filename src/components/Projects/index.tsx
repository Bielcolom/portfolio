"use client";
import { useInView } from "framer-motion";
import { useRef } from "react";
import ArrowIcon from "@/components/ArrowIcon";
import Magnetic from "@/components/Magnetic";
import Reveal from "@/components/Reveal";
import TextRoll from "@/components/TextRoll";
import { useLanguage } from "@/i18n/context";
import { ProjectItem } from "@/i18n/translations";
import styles from "./projects.module.scss";

const Row = ({ project, source, open }: { project: ProjectItem; source: string; open: string }) => {
  const ref = useRef<HTMLLIElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  return (
    <li ref={ref} className={styles.row} data-visible={visible || undefined}>
      <span className={styles.rule} aria-hidden />
      <div className={styles.top}>
        <h3 className={styles.name}>
          <span className={styles.nameInner}>{project.name}</span>
        </h3>
        <div className={styles.meta}>
          <span>{project.meta}</span>
          {project.award && <span className={styles.award}>{project.award}</span>}
        </div>
      </div>
      <div className={styles.body}>
        <p className={styles.desc}>{project.desc}</p>
        <div className={styles.side}>
          <ul className={styles.tech}>
            {project.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          {project.href && (
            <Magnetic>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.source}
                data-cursor="label"
                data-cursor-label={open}
              >
                <TextRoll text={source} />
                <ArrowIcon />
              </a>
            </Magnetic>
          )}
        </div>
      </div>
    </li>
  );
};

/** A plain list at display size: the projects have no screenshots to lean on, so the type carries them */
const Projects = () => {
  const { t } = useLanguage();

  return (
    <section id="projects" className={styles.projects} aria-labelledby="projects-title">
      <Reveal as="h2" id="projects-title" text={t.projects.title} className={styles.title} />
      <ol className={styles.list}>
        {t.projects.items.map((project) => (
          <Row key={project.name} project={project} source={t.projects.source} open={t.cursor.open} />
        ))}
      </ol>
    </section>
  );
};

export default Projects;
