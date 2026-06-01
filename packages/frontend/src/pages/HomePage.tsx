import { Card, CardContent } from "@/components/ui/card";
import { useHaptic } from "@/hooks/useHaptic";
import WebApp from "@twa-dev/sdk";
import { ChevronRight, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { impactLight } = useHaptic();
  const tgUser = WebApp.initDataUnsafe?.user;

  return (
    <div className="flex w-full max-w-md flex-col gap-4 p-4 antialiased text-foreground">
      <h1 className="text-2xl font-bold tracking-tight px-1">
        {t("welcome", { name: tgUser?.first_name || "User" })}
      </h1>

      {/* Кнопка-Ссылка на экран персонажа */}
      <Card
        onClick={() => {
          impactLight();
          navigate("/character");
        }}
        className="bg-card/40 border-muted/40 backdrop-blur-md cursor-pointer hover:bg-card/50 active:scale-[0.98] transition-all"
      >
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold block text-sm">
                {t("menu_character")}
              </span>
              <span className="text-xs text-muted-foreground">
                Повысить слои культивации и статы
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground/60" />
        </CardContent>
      </Card>
    </div>
  );
}
