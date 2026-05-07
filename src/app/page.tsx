import styles from "./page.module.scss";
import HeroFaceLanding from "@/components/HeroFaceLanding";
import LangToggle from "@/components/LangToggle";
import CodeRain from "@/components/CodeRain";

export default function Home() {
  return (
    <div className={styles.page}>
      <CodeRain />
      <div className={styles.navbar}>
        <LangToggle />
      </div>
      <main className={styles.main}>
        <HeroFaceLanding />
      </main>
    </div>
  );
}
