import { PageDescription } from "@/components/page_description";
import { PageNav } from "@/components/page_nav";
import { useTranslation } from "react-i18next";
import { nav_items } from "./home_nav";

export default function HomePage() {
  const { t } = useTranslation();

  // Собираем текст описания, используя интерполяцию i18next
  const descriptionText = `${t("home.welcome_wanderer")}! ${t("home.home_text")}`;

  return (
    <div className="friends-tab-con flex flex-col gap-2 transition-all duration-300 w-full max-w-md mx-auto antialiased">
      {/* Описание главной страницы */}
      <PageDescription
        title={t("home.ready_to_battle")}
        text={descriptionText}
        img="/home.jpg"
      />

      {/* Статистика противостояния фракций */}
      {/* <FactionConfrontationBar /> */}

      {/* Меню навигации главной страницы (в сетке 2x2 на основе вашего className) */}
      <PageNav
        nav_items={nav_items(t)}
        className="grid grid-cols-2 gap-2 mt-2"
      />
    </div>
  );
}
