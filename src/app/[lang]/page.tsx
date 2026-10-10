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
import { isLocale } from "@/content/site";
import { structuredData } from "@/content/structuredData";
import styles from "./page.module.scss";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(locale)).replace(/</g, "\\u003c"),
        }}
      />
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
