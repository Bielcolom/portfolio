"use client";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

/* Replaces the root layout, so it cannot rely on the site's stylesheets or
   fonts; inline styles keep it from preloading CSS on every page */
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
        background: "#0b0a09",
        color: "#efebe4",
        fontFamily: "system-ui, sans-serif",
        gap: "24px",
        textAlign: "center",
        padding: "0 24px",
      }}
    >
      <h1 style={{ fontSize: "clamp(32px, 8vw, 72px)", fontWeight: 700, margin: 0, letterSpacing: "-0.03em" }}>
        Something broke.
      </h1>
      <p style={{ fontSize: "16px", color: "#a6a197", margin: 0, maxWidth: "360px", lineHeight: 1.6 }}>
        An unexpected error occurred. You can try again or come back later.
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: "8px",
          padding: "12px 28px",
          borderRadius: "999px",
          border: "1px solid rgba(239, 235, 228, 0.26)",
          background: "transparent",
          color: "#efebe4",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </body>
  </html>
);

export default GlobalError;
