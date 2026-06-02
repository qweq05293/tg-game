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
      not_found_title: "Page Not Found",
      not_found_desc:
        "The requested resource does not exist or has been moved.",
      not_found_btn: "Go to Main",
      // backend errors
      err_character_not_found: "Character not found.",
      err_stat_peak_reached:
        "You have reached the peak of the current layer! Perform a breakthrough to level up {{statName}} further.",
      err_insufficient_qi:
        "Insufficient Qi. Required: {{cost}}, you have: {{current}}.",
      err_breakthrough_not_ready:
        "You have not yet reached the peak of the current stage (Layer 9 required).",
      err_insufficient_qi_breakthrough:
        "Insufficient Qi to break the celestial shackles! Required: {{cost}}.",
      err_auth_no_data: "Authentication data is missing.",
      err_auth_expired: "Session expired. Please reopen the app from Telegram.",
      err_auth_invalid_signature:
        "Security check failed. Invalid data signature.",
      err_token_missing: "Session token is missing. Please log in again.",
      err_token_invalid_or_expired:
        "Your session has expired. Re-authenticating...",
      err_claim_too_early:
        "It is too early, spiritual energy has not yet condensed.",
    },
    menu_character: "Character Cultivation",
    stat_strength: "Strength",
    stat_spirit: "Spirit",
    stat_agility: "Agility",
    stat_constitution: "Constitution",
    layer: "Layer {{level}}",
    stage_title: "Stage {{stage}}",
    claim_qi_btn: "Condense Qi",
    upgrade_btn: "Upgrade",
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
      not_found_title: "Страница не найдена",
      not_found_desc: "Запрашиваемый ресурс не существует или был перемещен.",
      not_found_btn: "На главную",
      // backend errors
      err_character_not_found: "Персонаж не найден.",
      err_stat_peak_reached:
        "Вы достигли пика текущего слоя! Совершите прорыв, чтобы качать {{statName}} дальше.",
      err_insufficient_qi:
        "Недостаточно Ци. Требуется: {{cost}}, у вас: {{current}}.",
      err_breakthrough_not_ready:
        "Вы еще не достигли пика текущей стадии (нужен 9 слой).",
      err_insufficient_qi_breakthrough:
        "Недостаточно Ци для прорыва небесных оков! Нужно: {{cost}}.",
      err_auth_no_data: "Данные авторизации отсутствуют.",
      err_auth_expired:
        "Сессия устарела. Пожалуйста, перезапустите приложение из Telegram.",
      err_auth_invalid_signature:
        "Ошибка безопасности. Неверная цифровая подпись.",
      err_token_missing:
        "Токен сессии отсутствует. Пожалуйста, войдите заново.",
      err_token_invalid_or_expired:
        "Ваша сессия истекла. Обновление авторизации...",
      err_claim_too_early: "Слишком рано, духовная энергия еще не сгустилась.",
      menu_character: "Развитие Персонажа",
      stat_strength: "Сила",
      stat_spirit: "Дух",
      stat_agility: "Ловкость",
      stat_constitution: "Телосложение",
      layer: "{{level}} Слой",
      stage_title: "{{stage}} Стадия",
      claim_qi_btn: "Собрать Ци",
      upgrade_btn: "Качать",
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
