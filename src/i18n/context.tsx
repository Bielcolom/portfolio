"use client";
import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { Locale, Translations, translations } from "./translations";

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  t: translations.en,
  setLocale: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

// --- Module-level locale store ---

const LOCALE_KEY = "locale";
const listeners = new Set<() => void>();
let storeLocale: Locale = "en";
let initialized = false;

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Called during render on the client. Reads localStorage once (lazily) and
// caches the result so subsequent calls are pure.
function getSnapshot(): Locale {
  if (!initialized) {
    initialized = true;
    try {
      const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
      storeLocale = (stored === "en" || stored === "es")
        ? stored
        : navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
    } catch {
      // localStorage unavailable (e.g. private mode) — keep default "en"
    }
  }
  return storeLocale;
}

// Called during SSR — must match the initial client render to avoid
// hydration mismatches. React reconciles the server/client difference
// internally after hydration.
function getServerSnapshot(): Locale {
  return "en";
}

function setLocaleInStore(next: Locale): void {
  storeLocale = next;
  try { localStorage.setItem(LOCALE_KEY, next); } catch { /* ignore */ }
  listeners.forEach((cb) => cb());
}

// --- Provider ---

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Only effect: keep <html lang> in sync with the active locale.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale: setLocaleInStore }}>
      {children}
    </LanguageContext.Provider>
  );
};
