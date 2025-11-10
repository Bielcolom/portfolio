import Image from "next/image";
import styles from "./page.module.scss";
import HeroFaceLanding from "@/components/HeroFaceLanding";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Hero ocupa toda la primera vista */}
        <HeroFaceLanding />
        {/* Bloque inferior opcional (logo + CTAs) fuera del hero para no empujar el monitor */}
        <div style={{ position: "absolute", top: 16, left: 32 }}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
        </div>
      </main>
    </div>
  );
}
