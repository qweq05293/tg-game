import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TelegramBackButton } from "@/components/TelegramBackButton";
import HomePage from "@/pages/HomePage";
import SettingsPage from "@/pages/SettingsPage";
import { Route, Routes } from "react-router-dom";
import { GameShell } from "./components/GameShell";
import LoginPage from "./pages/Login/LoginPage";

export default function App() {
  return (
    // Обернули всё приложение в глобальный контейнер с поддержкой тем и анимацией смены цвета
    <div className="bg-radial-primary min-h-screen w-full transition-colors duration-300">
      <TelegramBackButton />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<GameShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
