import { cn } from "@/lib/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "./ui/badge";

export function Soon({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { t } = useTranslation();

  return (
    <Badge
      className={cn(
        // Позиционирование и размеры
        "absolute -top-1 -right-2 z-10 flex h-5 min-w-10 items-center justify-center rounded-md px-1.5",
        // Стилизация и цвета (используем инвертированные цвета для контраста)
        "bg-foreground text-background text-[10px] font-extrabold uppercase tracking-wider",
        // Оптимизация для TWA (запрет выделения текста)
        "select-none pointer-events-none drop-shadow-sm",
        className,
      )}
      {...props}
    >
      {t("soon")}
    </Badge>
  );
}
