import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UpgradeStatDto } from "./dto/upgrade-stat.dto";

@Injectable()
export class CharacterService {
  constructor(private readonly prisma: PrismaService) {}

  async upgradeStat(userId: string, dto: UpgradeStatDto) {
    const character = await this.prisma.character.findUnique({
      where: { userId },
    });

    // Передаем объект с ключом перевода вместо сырого текста
    if (!character) {
      throw new BadRequestException({ key: "err_character_not_found" });
    }

    const { statName } = dto;
    const currentStatValue = character[statName];

    const maxStatLimit = character.level * 10;
    if (currentStatValue >= maxStatLimit) {
      throw new BadRequestException({
        key: "err_stat_peak_reached",
        args: { statName }, // передаем имя стата для фронтенда
      });
    }

    const cost = currentStatValue * 15;
    if (character.exp < cost) {
      throw new BadRequestException({
        key: "err_insufficient_qi",
        args: { cost, current: character.exp }, // передаем цифры стоимости
      });
    }

    let nextStrength = character.strength;
    let nextSpirit = character.spirit;
    let nextAgility = character.agility;
    let nextConstitution = character.constitution;

    if (statName === "strength") nextStrength++;
    if (statName === "spirit") nextSpirit++;
    if (statName === "agility") nextAgility++;
    if (statName === "constitution") nextConstitution++;

    const totalStats =
      nextStrength + nextSpirit + nextAgility + nextConstitution;
    const calculatedLevel = Math.floor(totalStats / 100) + 1;

    const updatedData: Prisma.CharacterUpdateInput = {
      exp: character.exp - cost,
      [statName]: currentStatValue + 1,
    };

    if (statName === "constitution") {
      updatedData.maxHp = nextConstitution * 10;
      updatedData.hp = character.hp + 10;
    }

    if (calculatedLevel > character.level && character.level < 9) {
      updatedData.level = calculatedLevel;
    }

    return this.prisma.character.update({
      where: { userId },
      data: updatedData,
    });
  }

  async breakthrough(userId: string) {
    const character = await this.prisma.character.findUnique({
      where: { userId },
    });
    if (!character)
      throw new BadRequestException({ key: "err_character_not_found" });

    if (character.level < 9) {
      throw new BadRequestException({ key: "err_breakthrough_not_ready" });
    }

    const breakthroughCost = character.stage * 1000;
    if (character.exp < breakthroughCost) {
      throw new BadRequestException({
        key: "err_insufficient_qi_breakthrough",
        args: { cost: breakthroughCost },
      });
    }

    return this.prisma.character.update({
      where: { userId },
      data: {
        exp: character.exp - breakthroughCost,
        stage: character.stage + 1,
        level: 1,
        strength: character.strength,
        spirit: character.spirit,
        agility: character.agility,
        constitution: character.constitution,
        maxHp: character.constitution * 10,
        hp: character.constitution * 10,
      },
    });
  }
}
