import React from "react";

interface CountdownTimerProps {
  endTime: number;
  label?: string;
  onComplete?: () => void;
  isDisabled?: boolean;
}

export function CountdownTimer({
  endTime,
  label,
  onComplete,
  isDisabled,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(() =>
    Math.max(endTime - Date.now(), 0),
  );

  // Используем ref, чтобы изменение функции onComplete не перезапускало таймер
  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  React.useEffect(() => {
    if (isDisabled || timeLeft <= 0) return;

    const interval = setInterval(() => {
      const diff = Math.max(endTime - Date.now(), 0);
      setTimeLeft(diff);

      if (diff <= 0) {
        clearInterval(interval);
        onCompleteRef.current?.();
      }
    }, 200); // Проверка 5 раз в секунду гарантирует точность, даже если вкладку свернули

    return () => clearInterval(interval);
  }, [endTime, isDisabled, timeLeft]);

  if (isDisabled) return <span>00:00</span>;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000); // Округление вверх лучше для игр
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    return `${minutes}:${pad(seconds)}`;
  };

  return (
    <span className="text-sm font-medium text-foreground/80 flex items-center gap-1">
      {label && <span>{label}</span>}
      {formatTime(timeLeft)}
    </span>
  );
}
