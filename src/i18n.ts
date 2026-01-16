"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "@/locales/en/translation.json";
import translationZH from "@/locales/zh/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  zh: {
    translation: translationZH,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already safes from xss
  },
});

export default i18n;
