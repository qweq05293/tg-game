import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Импортируем хук перевода

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Инициализируем функцию перевода

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center antialiased">
      {/* Иконка с мягким свечением */}
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-muted/30 text-muted-foreground backdrop-blur-md">
        <FileQuestion className="h-12 w-12 stroke-[1.5] animate-pulse" />
        <div className="absolute -inset-1 -z-10 rounded-2xl bg-primary/10 blur-xl" />
      </div>

      {/* Текстовый блок */}
      <div className="space-y-2 max-w-xs">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground font-mono">
          404
        </h1>
        <p className="text-lg font-semibold text-foreground/90">
          {t("not_found_title")}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("not_found_desc")}
        </p>
      </div>

      {/* Кнопка возврата на главную */}
      <div className="mt-8 w-full max-w-50">
        <Button
          onClick={() => navigate("/", { replace: true })}
          className="w-full gap-2 font-medium shadow-sm transition-transform active:scale-95"
          size="lg"
        >
          <Home className="h-4 w-4" />
          {t("not_found_btn")}
        </Button>
      </div>
    </div>
  );
}
