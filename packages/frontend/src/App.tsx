import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TelegramBackButton } from "@/components/TelegramBackButton";
import HomePage from "@/pages/Home/HomePage";
import NotFoundPage from "@/pages/NotFoundPage"; // Создайте этот компонент
import SettingsPage from "@/pages/SettingsPage";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GameShell } from "./components/GameShell";
import { injectNavigate } from "./lib/custom-instance"; // Путь к вашему кастомному инстансу
import CharacterPage from "./pages/CharacterPage";
import LoginPage from "./pages/Login/LoginPage";

export default function App() {
  const navigate = useNavigate();

  // Внедряем функцию navigate роутера внутрь Axios
  useEffect(() => {
    injectNavigate(navigate);
  }, [navigate]);

  return (
    <div className="bg-radial-primary min-h-screen w-full flex items-center justify-center transition-colors duration-300">
      <TelegramBackButton />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<GameShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/character" element={<CharacterPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Если пользователь вручную введет неверный роут в Mini App */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
