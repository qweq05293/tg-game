import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LoginLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex h-80 w-80 items-center justify-center ">
        <img
          src="/loading.png"
          alt="loading"
          className="w-full object-contain"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {t("loading")}
        </p>
      </div>
    </div>
  );
}
