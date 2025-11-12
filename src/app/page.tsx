import styles from "./page.module.scss";
import HeroFaceLanding from "@/components/HeroFaceLanding";

export default function Home() {
  return (
    <div className={styles.page}>
        <div className={styles.navbar}>
          <span>Actualmente la web está en desarrollo...</span>
          <span></span>
        </div>
      <main className={styles.main}>
        <HeroFaceLanding />
      </main>
    </div>
  );
}
