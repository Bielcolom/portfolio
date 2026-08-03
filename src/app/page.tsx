import styles from "./page.module.scss";
import HeroFaceLanding from "@/components/HeroFaceLanding";
import Sections from "@/components/Sections";
import LangToggle from "@/components/LangToggle";
import Socials from "@/components/Socials";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.navbar}>
        <Socials />
        <LangToggle />
      </div>
      <main className={styles.main}>
        <HeroFaceLanding />
        <Sections />
      </main>
    </div>
  );
}
