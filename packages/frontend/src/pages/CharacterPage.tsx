// Проверьте ваш путь к Orval хукам
import {
  useCharacterControllerGetMe,
  useCharacterControllerUpgradeStat,
} from "@/api/character/character";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useHaptic } from "@/hooks/useHaptic";
import { Award, Flame, Shield, Sparkles, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CharacterPage() {
  const { t } = useTranslation();
  const { impactLight, notificationSuccess } = useHaptic();

  // Получаем профиль персонажа с пассивным доходом
  const { data: profile, refetch } = useCharacterControllerGetMe();
  const char = profile;

  // Мутации для прокачки и сбора
  const { mutate: upgrade, isPending: isUpgrading } =
    useCharacterControllerUpgradeStat({
      mutation: {
        onSuccess: () => {
          notificationSuccess();
          refetch();
        },
      },
    });

  if (!char)
    return (
      <div className="text-center p-6 text-muted-foreground">
        {t("loading")}
      </div>
    );

  const stats = [
    {
      key: "strength",
      name: t("stat_strength"),
      value: char.strength,
      icon: Flame,
      color: "text-red-500 bg-red-500/10",
    },
    {
      key: "spirit",
      name: t("stat_spirit"),
      value: char.spirit,
      icon: Sparkles,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      key: "agility",
      name: t("stat_agility"),
      value: char.agility,
      icon: Zap,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      key: "constitution",
      name: t("stat_constitution"),
      value: char.constitution,
      icon: Shield,
      color: "text-emerald-500 bg-emerald-500/10",
    },
  ] as const;

  return (
    <div className="flex w-full max-w-md flex-col gap-4 p-4 antialiased text-foreground">
      {/* Шапка: Уровень культивации */}
      <Card className="bg-card/40 backdrop-blur-md border-muted/40">
        <CardContent className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("stage_title", { stage: char.stage })}
            </div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary animate-pulse" />
              {t("layer", { level: char.level })}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground block">
              Доступная Ци
            </span>
            <span className="text-lg font-extrabold text-primary font-mono">
              {char.exp}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Список Характеристик */}
      <div className="flex flex-col gap-2.5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const cost = stat.value * 15;
          const canAfford = char.exp >= cost;

          return (
            <Card
              key={stat.key}
              className="bg-card/30 border-muted/20 active:scale-[0.99] transition-transform"
            >
              <CardContent className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-semibold block text-sm">
                      {stat.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      Ци: {cost}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold font-mono">
                    {stat.value}
                  </span>
                  <Button
                    size="sm"
                    variant={canAfford ? "default" : "secondary"}
                    disabled={!canAfford || isUpgrading}
                    onClick={() => {
                      impactLight();
                      upgrade({ data: { statName: stat.key } });
                    }}
                    className="h-8 font-medium px-3 active:scale-95 transition-transform"
                  >
                    +{t("upgrade_btn")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
