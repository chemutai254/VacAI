import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_LANGUAGE } from "@/constants/languages";
import { storage } from "@/utils/storage";
import { getTranslation, getAllTranslations } from "@/utils/translations";

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => Promise<void>;
  t: (key: any) => string;
  isLanguageSelected: boolean;
  setIsLanguageSelected: (selected: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [isLanguageSelected, setIsLanguageSelectedState] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await storage.getLanguage();
    const languageSelected = await storage.getLanguageSelected();

    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
    setIsLanguageSelectedState(languageSelected);
  };

  const setLanguage = async (newLanguage: string) => {
    setLanguageState(newLanguage);
    await storage.setLanguage(newLanguage);
  };

  const setIsLanguageSelected = async (selected: boolean) => {
    setIsLanguageSelectedState(selected);
    await storage.setLanguageSelected(selected);
  };

  const t = (key: any) => getTranslation(language, key);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, isLanguageSelected, setIsLanguageSelected }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
