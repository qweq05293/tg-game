import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LoginLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-xl">
        <img src="/logo.png" alt="Logo" className="h-16 w-16 object-contain animate-pulse" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {t("loading") as string}
        </p>
      </div>
    </div>
  );
}
