// src/components/GameShell.tsx
import { Outlet } from "react-router-dom";
import { GameLayout } from "./GameLayout";

export function GameShell() {
  return (
    <GameLayout
      // Здесь вы определяете Хедер и Футер, общие для ВСЕХ страниц игры
      header={<div className="font-bold">RPG World</div>}
      footer={
        <div className="flex justify-around items-center gap-1 p-2">
           {/* Ваши кнопки навигации */}
           <span>Битва</span>
           <span>Карта</span>
           <span>Сумка</span>
           <span>Герой</span>
        </div>
      }
    >
      {/* Самое важное: Outlet рендерит дочерний роут (HomePage, SettingsPage) */}
      <Outlet />
    </GameLayout>
  );
}
