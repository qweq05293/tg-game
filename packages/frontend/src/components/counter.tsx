import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "./ui/badge";

interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  /** Позволяет показывать счетчик, даже если он равен 0 */
  showZero?: boolean;
}

export function Counter({
  count,
  showZero = false,
  className,
  ...props
}: CounterProps) {
  // Если счетчик 0 и не передан флаг強制тельного показа — ничего не рендерим
  if (count <= 0 && !showZero) return null;

  const isLongText = count > 9;

  return (
    <Badge
      className={cn(
        "absolute -top-1 -right-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-foreground/90 tabular-nums select-none",
        // Если цифра одна (1-9), делаем блок строго квадратным для идеального круга
        !isLongText ? "aspect-square p-0" : "px-1.5",
        className,
      )}
      {...props}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
