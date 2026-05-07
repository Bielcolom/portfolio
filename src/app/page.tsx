import styles from "./page.module.scss";
import HeroFaceLanding from "@/components/HeroFaceLanding";
import NavMessage from "@/components/NavMessage";
import LangToggle from "@/components/LangToggle";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.navbar}>
        <NavMessage />
        <LangToggle />
      </div>
      <main className={styles.main}>
        <HeroFaceLanding />
      </main>
    </div>
  );
}
