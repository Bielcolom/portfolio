import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found · Gabriel Colom Moll",
};

/* The root layout lives under [lang], so unmatched addresses land here, with
   their own document. Inline styles, as in global-error: no site CSS loads */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          padding: "0 24px",
          textAlign: "center",
          background: "#0b0a09",
          color: "#efebe4",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "clamp(32px, 8vw, 72px)", fontWeight: 700, margin: 0, letterSpacing: "-0.03em" }}>
          Page not found
        </h1>
        <p style={{ fontSize: "16px", color: "#a6a197", margin: 0, maxWidth: "360px", lineHeight: 1.6 }}>
          This address does not exist on the site.
        </p>
        <p style={{ margin: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px 24px" }}>
          <Link href="/" style={{ color: "#efebe4" }}>Portfolio in English</Link>
          <Link href="/es" lang="es" style={{ color: "#efebe4" }}>Portfolio en español</Link>
        </p>
      </body>
    </html>
  );
}
