import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

interface MainButtonProps extends React.ComponentPropsWithoutRef<
  typeof Button
> {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function MainButton({
  label,
  href,
  isLoading = false,
  icon,
  className,
  ...props // Позволяет прокидывать стандартные пропсы кнопки (variant, size и т.д.)
}: MainButtonProps) {
  // Если идет загрузка, мы рендерим обычную кнопку вместо ссылки,
  // чтобы полностью предотвратить навигацию и сделать это семантически верным
  if (isLoading) {
    return (
      <Button
        size="lg"
        disabled
        className={cn(
          "w-full bg-primary/70 flex gap-2 items-center justify-center transition-all opacity-50",
          className,
        )}
        {...props}
      >
        <Spinner className="w-4 h-4 animate-spin" />
        {icon}
        <span>{label}</span>
      </Button>
    );
  }

  return (
    <Button
      asChild
      size="lg"
      className={cn(
        "w-full bg-primary/70 flex gap-2 items-center justify-center transition-all active:scale-[0.99]",
        className,
      )}
      {...props}
    >
      <Link to={href}>
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  );
}
