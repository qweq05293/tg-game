import { cn } from "@/lib/utils";
import { MainButton } from "./main_button";
import { Soon } from "./soon";

export type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  /** Флаг указывает, что раздел находится в разработке */
  isSoon?: boolean;
};

interface PageNavProps {
  nav_items: NavItem[];
  className?: string;
}

export function PageNav({
  nav_items,
  className = "flex flex-col gap-2",
}: PageNavProps) {
  return (
    <nav className={cn("transition-opacity duration-200 w-full", className)}>
      {nav_items.map((item) => {
        const { href, label, icon, isSoon } = item;

        return (
          <div
            key={href}
            className={cn(
              "relative w-full transition-all",
              isSoon && "opacity-60 pointer-events-none select-none", // Полностью блокируем клики, если фича еще не готова
            )}
          >
            <MainButton
              label={label}
              // Если фича "скоро", заменяем реальный путь на пустой хэш во избежание переходов
              href={isSoon ? "#" : href}
              icon={icon}
            />
            {isSoon && <Soon />}
          </div>
        );
      })}
    </nav>
  );
}
