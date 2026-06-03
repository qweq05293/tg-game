import { useCharacterStore } from "@/store/character_store";
import {
  Coins,
  Compass, // Для энергии / выносливости / зарядов
  Gem, // Для премиум кристаллов / самоцветов
  Hammer,
  ShieldCheck, // Для материалов / осколков / руды
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function Header() {
  const { t } = useTranslation();
  const character = useCharacterStore((state) => state.character);

  // Сетка игровых ресурсов с понятными лейблами и яркими акцентами
  const resources = [
    {
      icon: <Coins className="h-4 w-4 text-amber-400" />,
      label: "Монеты",
      // Подставьте реальное поле из вашего DTO, когда оно появится (например, character.coins)
      value: 0,
      href: "/shop",
    },
    {
      icon: <Zap className="h-4 w-4 text-cyan-400" />,
      label: "Энергия",
      // Используйте актуальное поле энергии или зарядов боя
      value: "10/10",
      href: "/fight",
    },
    {
      icon: <Gem className="h-4 w-4 text-purple-400" />,
      label: "Кристаллы",
      // Премиум валюта / духовные камни
      value: 0,
      href: "/bank",
    },
    {
      icon: <Hammer className="h-4 w-4 text-rose-400" />,
      label: "Материалы",
      // Осколки, ресурсы для крафта или добычи
      value: 0,
      href: "/mine",
    },
  ];

  return (
    <div className="w-full   backdrop-blur-md flex flex-col  gap-2 select-none antialiased">
      {/* Верхний ряд: Профиль и Стадия культивации */}

      <Link
        to="/character"
        className="flex items-center justify-between gap-3 w-full  hover:bg-primary/10 active:scale-[0.98] transition-all p-3 rounded-xl border border-white/5 shadow-sm group"
      >
        {/* БЛОК 1: Имя и Аватар */}
        <div className="flex items-center gap-3 min-w-0">
          {character?.avatar ? (
            <img
              src={
                typeof character?.avatar === "string"
                  ? character.avatar
                  : "login.png"
              }
              alt={character?.name}
              className="h-10 w-10 rounded-full object-cover border border-white/10 shrink-0"
            />
          ) : (
            // Элегантный игровой аватар по умолчанию с первыми буквами имени
            <div className="h-10 w-10 rounded-xl  border border-primary/20 text-primary flex items-center justify-center text-xs font-black shrink-0 group-hover:from-primary/30 transition-all">
              {character?.name.substring(1, 3).toUpperCase() || "??"}
            </div>
          )}

          {/* Имя / Никнейм */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white leading-none truncate">
              {character?.name}
            </span>
            <span className="text-[10px] text-muted-foreground mt-1 leading-none flex items-center gap-0.5">
              <ShieldCheck className="h-3 w-3 text-primary/80" />{" "}
              {t("profile_verified", "Игрок")}
            </span>
          </div>
        </div>

        {/* БЛОК 2: Стадия и Уровень */}
        <div className="flex items-center gap-3 border-l border-white/5 pl-4 shrink-0">
          <div className="flex flex-col items-end">
            {/* Стадия */}
            <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Compass className="h-3 w-3" /> {t("cultivation_stage", "Стадия")}
            </span>
            <span className="text-sm font-black text-amber-300 leading-none mt-1">
              {character?.stage}
            </span>

            {/* Уровень */}
            <span className="text-[10px] text-muted-foreground font-semibold mt-1.5 leading-none">
              {t(
                "character_level",
                "Ур. {{level}}", // 👈 Default value goes second
                { level: character?.level }, // 👈 Options/Variables go third
              )}
            </span>
          </div>
        </div>
      </Link>

      {/* Средний ряд: Полосы прогресса HP и EXP */}
      {/* <HeaderProgressBars
        currentHP={character.hp}
        maxHP={character.maxHp}
        currentExp={character.exp}
        level={character.level}
      /> */}

      {/* Нижний ряд: Сетка игровых ресурсов */}
      <div className="grid grid-cols-4 gap-1.5 w-full mt-0.5">
        {resources.map((res, idx) => (
          <Link
            key={idx}
            to={res.href}
            className="flex flex-col items-center justify-center p-2 rounded-xl  active:scale-[0.97] transition-all text-center"
          >
            <div className="mb-1">{res.icon}</div>
            <span className="text-[9px] text-muted-foreground font-medium leading-none">
              {res.label}
            </span>
            <span className="text-xs font-bold text-white mt-1 leading-none tabular-nums">
              {res.value}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
