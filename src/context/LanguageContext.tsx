"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/i18n";
import { LogoOption } from "@/components/ui/AALogo";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  logoOption: LogoOption;
  setLogoOption: (opt: LogoOption) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  logoOption: 1,
  setLogoOption: () => {},
  t: (key) => translations.en[key] || String(key),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language: Language = "en";
  const [logoOption, setLogoOptionState] = useState<LogoOption>(1);

  useEffect(() => {
    // Clean legacy language cache if present
    try {
      localStorage.removeItem("app_lang");
      const savedLogo = localStorage.getItem("app_logo_opt");
      if (savedLogo && ["1", "2", "3"].includes(savedLogo)) {
        setLogoOptionState(Number(savedLogo) as LogoOption);
      }
    } catch {
      // Ignore localStorage exceptions in restrictive environments
    }
  }, []);

  const setLanguage = () => {};

  const setLogoOption = (opt: LogoOption) => {
    setLogoOptionState(opt);
    try {
      localStorage.setItem("app_logo_opt", String(opt));
    } catch {
      // ignore
    }
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, logoOption, setLogoOption, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
