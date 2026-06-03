import { cn } from "@/lib/utils";
import React from "react";
import { Spinner } from "./ui/spinner";

interface ComponentSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Кастомный размер самого спиннера (по умолчанию w-6 h-6) */
  spinnerClassName?: string;
}

export function ComponentSpinner({
  className,
  spinnerClassName,
  ...props
}: ComponentSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Загрузка..."
      className={cn("flex items-center justify-center h-40 w-full", className)}
      {...props}
    >
      <Spinner
        className={cn(
          "w-6 h-6 text-muted-foreground animate-spin", // Явно добавляем вращение
          spinnerClassName,
        )}
      />
      {/* Скрытый текст для скринридеров */}
      <span className="sr-only">Загрузка...</span>
    </div>
  );
}
