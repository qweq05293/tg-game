import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TimeAgoProps {
  date: number; // Unix timestamp в мс
  className?: string;
}

export const TimeAgo = ({ date, className }: TimeAgoProps) => {
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const timeDiff = currentTime - date;
  const minutes = Math.floor(timeDiff / (60 * 1000));

  useEffect(() => {
    // Оптимизация: если прошло больше 24 часов, таймер обновлений не нужен
    if (timeDiff >= 24 * 60 * 60 * 1000) return;

    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [timeDiff]);

  // Сценарий 1: Прошло больше суток — выводим красивую дату через Intl
  if (timeDiff >= 24 * 60 * 60 * 1000) {
    const formattedDate = new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);

    return <span className={cn("text-sm", className)}>{formattedDate}</span>;
  }

  // Сценарий 2: Меньше минуты назад
  if (minutes < 1) {
    return <span className={className}>Только что</span>;
  }

  // Сценарий 3: Вычисляем часы или минуты с идеальным русским склонением через Intl
  const hours = Math.floor(minutes / 60);
  const rtf = new Intl.RelativeTimeFormat("ru-RU", { style: "long" });

  if (hours >= 1) {
    return <span className={className}>{rtf.format(-hours, "hour")}</span>;
  }

  return <span className={className}>{rtf.format(-minutes, "minute")}</span>;
};
