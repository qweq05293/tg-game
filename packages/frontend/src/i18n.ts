import WebApp from "@twa-dev/sdk";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      loading: "Authorizing...",
      error_title: "Authentication Error",
      error_desc: "Please restart the app inside Telegram.",
      retry: "Try again",
      welcome: "Welcome, {{name}}!",
      balance: "Your balance: {{count}} coins",
      settings_title: "Settings",
      battle: "Battle",
      settings_subtitle: "Customize your Mini App",
      theme_mode: "Display Mode",
      theme_dark: "Dark Theme",
      theme_light: "Light Theme",
      accent_color: "Accent Color",
      language: "Interface Language",
      btn_back: "Go to Main",
      color_blue: "Blue",
      color_green: "Green",
      color_red: "Red",
      color_yellow: "Yellow",
      color_reset: "Reset",
    },
  },
  ru: {
    translation: {
      loading: "Авторизация...",
      error_title: "Ошибка входа",
      error_desc: "Пожалуйста, откройте приложение заново внутри Telegram.",
      retry: "Повторить попытку",
      welcome: "Добро пожаловать, {{name}}!",
      balance: "Ваш баланс: {{count}} монет",
      settings_title: "Настройки",
      battle: "Битва",
      settings_subtitle: "Персонализация вашего Mini App",
      theme_mode: "Режим отображения",
      theme_dark: "Темная тема",
      theme_light: "Светлая тема",
      accent_color: "Акцентный цвет",
      language: "Язык интерфейса",
      btn_back: "На главную",
      color_blue: "Синий",
      color_green: "Зеленый",
      color_red: "Красный",
      color_yellow: "Желтый",
      color_reset: "Сбросить",
    },
  },
};

const getTelegramLanguage = (): string => {
  const tgLang = WebApp.initDataUnsafe?.user?.language_code;
  return tgLang && ["ru", "en"].includes(tgLang) ? tgLang : "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getTelegramLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
