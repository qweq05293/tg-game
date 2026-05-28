import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import WebApp from "@twa-dev/sdk";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, token } = useAuthStore((state) => state); // Просто чтобы триггерить ререндер при изменении авторизации

  // Достаем имя игрока прямо из нативного кэша Telegram
  const tgUser = WebApp.initDataUnsafe?.user;

  return (
    <div className="flex  flex-col gap-5 items-center justify-center p-2 antialiased">
      <h1 className="text-2xl font-bold mb-2">
        {t("welcome", { name: tgUser?.first_name || "User" })}
      </h1>
  <pre className="w-full whitespace-pre-wrap break-all bg-muted p-3 rounded-md text-xs">
  {JSON.stringify(user, null, 2)}
</pre>

<pre className="w-full whitespace-pre-wrap break-all bg-muted p-3 rounded-md text-xs">
  {JSON.stringify(token)}
</pre>
      <Button
        onClick={() => navigate("/settings")}
        className="gap-2 bg-primary text-primary-foreground"
      >
        <Settings className="h-4 w-4" /> {t("settings_title")}
      </Button>
    </div>
  );
}
