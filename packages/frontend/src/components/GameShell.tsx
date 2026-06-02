// src/components/GameShell.tsx
import { Settings, Swords } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { GameLayout } from "./GameLayout";
import { useTranslation } from "react-i18next";

export function GameShell() {
  const { t } = useTranslation();
  return (
    <GameLayout
      // Здесь вы определяете Хедер и Футер, общие для ВСЕХ страниц игры
      header={<div className="font-bold">RPG World</div>}
      footer={
        <nav className="flex justify-around items-center w-full ">
          {/* Ссылка на Главную (Битва) */}
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

          {/* Настройки */}
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
      {/* Самое важное: Outlet рендерит дочерний роут (HomePage, SettingsPage) */}
      <Outlet />
    </GameLayout>
  );
}
