import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import WebApp from "@twa-dev/sdk";

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Достаем имя игрока прямо из нативного кэша Telegram
  const tgUser = WebApp.initDataUnsafe?.user;

  return (
   <div className="flex min-h-screen flex-col items-center justify-center p-6 antialiased">
      <h1 className="text-2xl font-bold mb-6">
        {t("welcome", { name: tgUser?.first_name || "User" })}
      </h1>
      <Button onClick={() => navigate("/settings")} className="gap-2 bg-primary text-primary-foreground">
        <Settings className="h-4 w-4" /> {t("settings_title")}
      </Button>
    </div>
  );
}
