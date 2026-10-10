"use client";
import { createContext, useContext, useState } from "react";
import { pageSeo } from "@/content/metadata";
import { LOCALE_COOKIE, PAGE_PATH, pageAt } from "@/content/site";
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
 * The route decides the language: every page has an English and a Spanish
 * address, rendered on the server in that language, so the first render
 * already matches and nothing is detected on the client. Switching swaps the
 * strings in place, then moves the address to the same page's twin and keeps
 * the title, <html lang> and the remembered choice in line with the screen.
 */
export const LanguageProvider = ({ locale: initial, children }: {
  locale: Locale;
  children: React.ReactNode;
}) => {
  const [locale, setLocaleState] = useState<Locale>(initial);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const page = pageAt(window.location.pathname);
    // The router keeps its state in history.state, so it is passed through
    const url = PAGE_PATH[page][next] + window.location.search + window.location.hash;
    window.history.replaceState(window.history.state, "", url);
    document.documentElement.lang = next;
    document.title = pageSeo(page, translations[next]).title;
  };

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};
