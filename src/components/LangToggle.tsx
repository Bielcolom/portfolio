"use client";
import { useLanguage } from "@/i18n/context";

const LangToggle = () => {
  const { locale, setLocale } = useLanguage();
  const next = locale === "en" ? "es" : "en";

  return (
    <button
      onClick={() => setLocale(next)}
      style={{
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "var(--text-primary)",
        borderRadius: "6px",
        padding: "3px 10px",
        fontSize: "11px",
        fontFamily: "var(--font-geist-mono)",
        cursor: "pointer",
        letterSpacing: "0.08em",
        opacity: 0.55,
        transition: "opacity 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
    >
      {locale.toUpperCase()}
    </button>
  );
};

export default LangToggle;
