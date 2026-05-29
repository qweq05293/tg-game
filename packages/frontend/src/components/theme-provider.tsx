import WebApp from "@twa-dev/sdk";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
type AccentColor = "blue" | "green" | "red" | "yellow" | null;

type ThemeProviderState = {
  theme: Theme;
  color: AccentColor;
  setTheme: (theme: Theme) => void;
  setColor: (color: AccentColor) => void;
};

// Создаем контекст (не экспортируем его наружу, чтобы не злить Fast Refresh)
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
);

// const THEME_HEX_COLORS: Record<Theme, `#${string}`> = {
//   light: "#fff",
//   dark: "#0f0f0f",
// };
const COLOR_CLASSES: Exclude<AccentColor, null>[] = [
  "blue",
  "green",
  "red",
  "yellow",
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    WebApp.colorScheme === "light" ? "light" : "dark",
  );
  const [color, setColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem("tg-app-accent");
    if (!saved || saved === "default") return null;
    return saved as AccentColor;
  });

  useEffect(() => {
    WebApp.enableClosingConfirmation();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    COLOR_CLASSES.forEach((cls) => root.classList.remove(`color-${cls}`));

    if (color) {
      root.classList.add(`color-${color}`);
      localStorage.setItem("tg-app-accent", color);
    } else {
      localStorage.setItem("tg-app-accent", "default");
    }

    // const targetHex = THEME_HEX_COLORS[theme];
    // try {
    //   WebApp.setHeaderColor(targetHex);
    //   WebApp.setBackgroundColor(targetHex);
    // } catch (error) {
    //   // Логируем ошибку или добавляем комментарий, чтобы ESLint не ругался на пустой catch
    //   console.warn("Telegram WebApp color setup failed:", error);
    // }
  }, [theme, color]);

  useEffect(() => {
    const handleThemeChange = () =>
      setThemeState(WebApp.colorScheme === "light" ? "light" : "dark");
    WebApp.onEvent("themeChanged", handleThemeChange);
    return () => WebApp.offEvent("themeChanged", handleThemeChange);
  }, []);

  return (
    <ThemeProviderContext.Provider
      value={{ theme, color, setTheme: setThemeState, setColor: setColorState }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Чтобы обойти ограничение Fast Refresh на экспорт функций/хуков из файла с компонентом,
// мы вешаем специальную директиву для ESLint на этот экспорт:
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme error");
  return context;
};
