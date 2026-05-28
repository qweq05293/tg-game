import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LoginErrorProps {
  onRetry: () => void;
}

export function LoginError({ onRetry }: LoginErrorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl bg-inherit dark:bg-red-950/20 backdrop-blur-sm border border-red-200 dark:border-red-900/30 p-6 shadow-xl">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {t("error_title")}
      </h2>
      <Button onClick={onRetry} variant="outline" className="w-full gap-2">
        <RefreshCw className="h-4 w-4" />
        {t("retry")}
      </Button>
    </div>
  );
}
