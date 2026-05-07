"use client";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ reset }: Props) => (
  <html lang="en">
    <body
      style={{
        margin: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        gap: "24px",
        textAlign: "center",
        padding: "0 24px",
      }}
    >
      <p style={{ fontSize: "13px", opacity: 0.4, letterSpacing: "0.1em", margin: 0 }}>
        GABRIEL COLOM MOLL / PORTFOLIO
      </p>
      <h1 style={{ fontSize: "clamp(32px, 8vw, 72px)", fontWeight: 700, margin: 0, letterSpacing: "-0.03em" }}>
        Something broke.
      </h1>
      <p style={{ fontSize: "16px", opacity: 0.5, margin: 0, maxWidth: "360px", lineHeight: 1.6 }}>
        An unexpected error occurred. You can try again or come back later.
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: "8px",
          padding: "10px 28px",
          borderRadius: "128px",
          border: "1px solid rgba(255,255,255,0.18)",
          background: "transparent",
          color: "#fff",
          fontSize: "14px",
          cursor: "pointer",
          letterSpacing: "0.04em",
        }}
      >
        Try again
      </button>
    </body>
  </html>
);

export default GlobalError;
