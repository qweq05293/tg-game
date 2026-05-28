import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useHaptic } from "@/hooks/useHaptic";
import {
  ArrowLeft,
  Languages,
  Moon,
  Palette,
  Settings,
  Sun,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, color, setColor } = useTheme();
  const navigate = useNavigate();
  const { impactLight, notificationSuccess } = useHaptic();

  // Добавляем дефолтный элемент с id: null
  const colors: { id: typeof color; nameKey: string; bgClass: string }[] = [
    {
      id: null,
      nameKey: "color_default",
      bgClass: "bg-slate-400 dark:bg-slate-600",
    }, // Опция сброса
    { id: "blue", nameKey: "color_blue", bgClass: "bg-blue-500" },
    { id: "green", nameKey: "color_green", bgClass: "bg-emerald-500" },
    { id: "red", nameKey: "color_red", bgClass: "bg-rose-500" },
    { id: "yellow", nameKey: "color_yellow", bgClass: "bg-amber-500" },
  ];

  return (
    <div className="flex  flex-col items-center justify-center p-6 antialiased">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white dark:bg-slate-900/40 p-6 border border-slate-200 dark:border-slate-800/80 shadow-md backdrop-blur-sm">
        <div className="text-center space-y-1">
          <Settings className="h-10 w-10 mx-auto text-primary mb-2" />
          <h1 className="text-xl font-bold">{t("settings_title")}</h1>
        </div>

        {/* Тема */}
        <Button
          variant="outline"
          onClick={() => {
            impactLight();
            setTheme(theme === "dark" ? "light" : "dark");
          }}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === "dark" ? t("theme_light") : t("theme_dark")}
          </span>
        </Button>

        {/* Язык */}
        <Button
          variant="outline"
          onClick={() => {
            impactLight();
            i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
          }}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            {i18n.language === "ru" ? "Русский" : "English"}
          </span>
        </Button>

        {/* Цвета */}
        <div className="space-y-2">
          <label className="text-xs font-bold flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5" /> {t("accent_color")}
          </label>
          {/* Изменили grid-cols-4 на grid-cols-5, чтобы поместилось 5 кнопок */}
          <div className="grid grid-cols-5 gap-1.5">
            {colors.map((c) => (
              <button
                key={c.id ?? "default"}
                onClick={() => {
                  impactLight();
                  setColor(c.id);
                }}
                className={`flex h-14 flex-col items-center justify-center rounded-xl border transition-all ${
                  color === c.id
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <span className={`h-3.5 w-3.5 rounded-full ${c.bgClass}`} />
                <span className="mt-1 text-[9px] text-center px-0.5 truncate w-full">
                  {c.id === null ? t("default", "Сброс") : t(c.nameKey)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => {
            notificationSuccess();
            navigate("/");
          }}
          className="w-full bg-primary text-primary-foreground gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("btn_back")}
        </Button>
      </div>
    </div>
  );
}
