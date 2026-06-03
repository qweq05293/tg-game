import type { NavItem } from "@/components/page_nav";

// Передаем функцию t напрямую для клиентского перевода
export const nav_items = (t: (key: string) => string): NavItem[] => [
  {
    label: t("menu_character"),
    href: "/character",
    // icon: <UserIcon />,
  },
  {
    label: t("menu_meditation"),
    href: "/meditation",
    // icon: <MeditationIcon />,
  },
  {
    label: t("menu_clans"),
    href: "/clans",
    isSoon: true, // Наш новый флаг для заблокированных разделов
  },
  {
    label: t("menu_shop"),
    href: "/shop",
    isSoon: true,
  },
];
