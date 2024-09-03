import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

const getDefaultLanguage = () => {
  const storedLanguage = localStorage.getItem("language");
  if (storedLanguage) {
    document.body.dir = storedLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = storedLanguage;
    return storedLanguage;
  } else {
    document.documentElement.lang = "en";
    document.body.dir = "ltr";
    localStorage.setItem("language", "en");
    return "en";
  }
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    // Default language
    lng: getDefaultLanguage(),
    // Fallback language
    fallbackLng: "en",
    // Language detection
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    // Backend options for fetching translations
    backend: {
      loadPath: `${import.meta.env.VITE_API_URL}/locales/{{lng}}.json`, // Adjust the path based on your backend setup
    },
    // Enable debug mode
    // debug: true,
    // React specific options
    react: {
      useSuspense: false,
    },
  });

export default i18n;
