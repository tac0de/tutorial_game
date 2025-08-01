"use client"

import { useState, useEffect } from "react"
import { translations, Language } from "@/lib/translations"

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ko")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("preferred-language", newLanguage)
  }

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key as keyof typeof translations.en] || translations.en[key as keyof typeof translations.en]
  }

  return {
    language,
    changeLanguage,
    t,
    isKorean: language === "ko"
  }
}