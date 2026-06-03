import { Settings, Swords } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";
import { GameLayout } from "./GameLayout";
import { useCharacterStore } from "@/store/character_store";
import { useCharacterControllerGetMe } from "@/api/character/character";
import { ComponentSpinner } from "./component_spinner";
import { Header } from "./Header";

export function GameShell() {
  const { t } = useTranslation();

  // Достаем методы из Zustand стора
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const character = useCharacterStore((state) => state.character);

  // Делаем запрос к эндпоинту /character/me
  // (onSuccess удален из параметров query согласно правилам TanStack Query v5)
  const { data, isLoading, isError } = useCharacterControllerGetMe();

  // Идеальная замена onSuccess в v5: отслеживаем появление/обновление данных через useEffect
  useEffect(() => {
    if (data) {
      setCharacter(data);
    }
  }, [data, setCharacter]);

  // Если данных в сторе еще нет и идет первичная загрузка — показываем спиннер
  if (isLoading && !character) {
    return (
      <div className="flex items-center justify-center h-screen w-full max-w-md ">
        <ComponentSpinner className="h-20" />
      </div>
    );
  }

  // Обработка критической ошибки авторизации
  if (isError && !character) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full max-w-md p-6 bg-background text-center text-destructive">
        <p className="font-bold mb-2">{t("error_title")}</p>
        <p className="text-sm opacity-80">{t("error_desc")}</p>
      </div>
    );
  }

  return (
    <GameLayout
      header={<Header />}
      footer={
        <nav className="flex justify-around items-center w-full">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Swords className="h-5 w-5" />
            <span>{t("battle")}</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span>{t("settings_title")}</span>
          </NavLink>
        </nav>
      }
    >
      <Outlet />
    </GameLayout>
  );
}
