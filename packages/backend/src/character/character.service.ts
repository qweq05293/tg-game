import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CharacterResponseDto, UpgradeStatDto } from "./dto/upgrade-stat.dto";

@Injectable()
export class CharacterService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. Вспомогательный метод: расчет накопленной Ци в реальном времени
   */

  /**
   * 2. Получение профиля персонажа с динамическими данными пассивного дохода
   */
  async getCharacter(userId: string): Promise<CharacterResponseDto> {
    const character = await this.prisma.character.findUnique({
      where: { userId },
    });

    if (!character) {
      throw new BadRequestException({ key: "err_character_not_found" });
    }

    return character;
  }

  /**
   * 3. Метод сбора накопленной пассивной Ци
   */

  /**
   * 4. Прокачка характеристик персонажа за Ци (Возвращает чистое DTO)
   */
  async upgradeStat(
    userId: string,
    dto: UpgradeStatDto,
  ): Promise<CharacterResponseDto> {
    const character = await this.prisma.character.findUnique({
      where: { userId },
    });

    if (!character) {
      throw new BadRequestException({ key: "err_character_not_found" });
    }

    const { statName } = dto;
    const currentStatValue = character[statName];

    // Лимит прокачки статов равен: Уровень * 10
    const maxStatLimit = character.level * 10;
    if (currentStatValue >= maxStatLimit) {
      throw new BadRequestException({
        key: "err_stat_peak_reached",
        args: { statName },
      });
    }

    // Расчет стоимости: текущее значение * 15 Ци
    const cost = currentStatValue * 15;
    if (character.exp < cost) {
      throw new BadRequestException({
        key: "err_insufficient_qi",
        args: { cost, current: character.exp },
      });
    }

    // Локальные переменные для безопасного расчета общей суммы статов (число + число)
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

    // Каждые 100 суммарных характеристик повышают под-уровень (слой) персонажа
    const calculatedLevel = Math.floor(totalStats / 100) + 1;

    const updatedData: Prisma.CharacterUpdateInput = {
      exp: character.exp - cost,
      [statName]: currentStatValue + 1,
    };

    // Если качается Телосложение — увеличиваем максимальное и текущее здоровье
    if (statName === "constitution") {
      updatedData.maxHp = nextConstitution * 10;
      updatedData.hp = character.hp + 10;
    }

    // Повышение уровня возможно только до 9 слоя (Пик стадии)
    if (calculatedLevel > character.level && character.level < 9) {
      updatedData.level = calculatedLevel;
    }

    return this.prisma.character.update({
      where: { userId },
      data: updatedData,
    });
  }

  /**
   * 5. Ручной прорыв на следующую крупную стадию (Возвращает чистое DTO)
   */
  async breakthrough(userId: string): Promise<CharacterResponseDto> {
    const character = await this.prisma.character.findUnique({
      where: { userId },
    });

    if (!character) {
      throw new BadRequestException({ key: "err_character_not_found" });
    }

    // Прорыв доступен только на 9 слое (Пик текущей стадии)
    if (character.level < 9) {
      throw new BadRequestException({ key: "err_breakthrough_not_ready" });
    }

    // Стоимость прорыва: текущая Стадия * 1000 Ци
    const breakthroughCost = character.stage * 1000;
    if (character.exp < breakthroughCost) {
      throw new BadRequestException({
        key: "err_insufficient_qi_breakthrough",
        args: { cost: breakthroughCost },
      });
    }

    // Прорыв повышает стадию, сбрасывает слой в 1 и полностью исцеляет персонажа
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
