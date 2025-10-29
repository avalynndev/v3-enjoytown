"use client";

import type { Language } from "@/types/languages";
import type { Dictionary } from "@/utils/dictionaries";
import { type ReactNode, createContext, useContext, useEffect } from "react";

type LanguageContextProviderProps = {
  children: ReactNode;
  language: Language;
  dictionary: Dictionary;
};

type LanguageContextType = {
  language: Language;
  dictionary: Dictionary;
  setLanguage: (lang: Language) => void;
};

export const languageContext = createContext({} as LanguageContextType);

export const LanguageContextProvider = ({
  children,
  language,
  dictionary,
}: LanguageContextProviderProps) => {
  useEffect(() => {
    localStorage.setItem("language", language);
    document.cookie = `language=${language}; path=/;`;
  }, [language]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    document.cookie = `language=${lang}; path=/;`;
  };

  return (
    <languageContext.Provider value={{ language, dictionary, setLanguage }}>
      {children}
    </languageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(languageContext);

  if (!context) {
    throw new Error(
      "LanguageContext must be used within LanguageContextProvider",
    );
  }

  return context;
};
