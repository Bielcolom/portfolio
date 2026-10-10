import About from "@/components/About";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Hero from "@/components/Hero";
import Panel from "@/components/Panel";
import Particles from "@/components/Particles";
import Projects from "@/components/Projects";
import SiteNav from "@/components/SiteNav";
import Stack from "@/components/Stack";
import Story from "@/components/Story";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <>
      <SiteNav />
      <Particles />
      <main id="main" className={styles.main}>
        <Hero />
        <About />
        <Story />
        <Panel>
          <Projects />
          <Stack />
          <Education />
        </Panel>
      </main>
      <Contact />
    </>
  );
}
