"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { LOCALE_COOKIE, LOCALE_PATH } from "@/content/site";
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

/**
 * The route decides the language: "/" renders English and "/es" Spanish, on
 * the server, so the first render already matches and nothing is detected on
 * the client. Switching swaps the strings in place, then keeps the address,
 * the title and the remembered choice in line with what is on screen.
 */
export const LanguageProvider = ({ locale: initial, children }: {
  locale: Locale;
  children: React.ReactNode;
}) => {
  const [locale, setLocaleState] = useState<Locale>(initial);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // The router keeps its state in history.state, so it is passed through
    const url = LOCALE_PATH[next] + window.location.search + window.location.hash;
    window.history.replaceState(window.history.state, "", url);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = translations[locale].seo.title;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};
