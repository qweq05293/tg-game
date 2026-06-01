import { BadRequestException, Injectable } from "@nestjs/common";
import { Character, Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import {
  CharacterResponseDto,
  CharacterWithPendingResponseDto,
  UpgradeStatDto,
} from "./dto/upgrade-stat.dto";

const MAX_AFK_TIME_MS = 8 * 60 * 60 * 1000; // Лимит накопления: 8 часов

@Injectable()
export class CharacterService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. Вспомогательный метод: расчет накопленной Ци в реальном времени
   */
  calculatePendingQi(character: Character) {
    const now = Date.now();

    // Безопасное приведение типа для обхода багов автогенерации Prisma в IDE
    const lastClaimDate = character.lastClaimAt;
    const lastClaim = lastClaimDate.getTime();

    let elapsedMs = now - lastClaim;
    let isFull = false;

    // Ограничение накопления в 8 часов
    if (elapsedMs >= MAX_AFK_TIME_MS) {
      elapsedMs = MAX_AFK_TIME_MS;
      isFull = true;
    }

    // Скорость генерации: (Дух * 1) единиц Ци в секунду
    const qiPerSecond = character.spirit * 1;
    const elapsedSeconds = elapsedMs / 1000;
    const pendingQi = Math.floor(elapsedSeconds * qiPerSecond);

    // Расчет оставшегося времени до заполнения склада
    const totalLimitSeconds = MAX_AFK_TIME_MS / 1000;
    const secondsLeft = Math.max(
      0,
      Math.floor(totalLimitSeconds - elapsedSeconds),
    );

    return { pendingQi, isFull, secondsLeft };
  }

  /**
   * 2. Получение профиля персонажа с динамическими данными пассивного дохода
   */
  async getCharacterWithPending(
    userId: string,
  ): Promise<CharacterWithPendingResponseDto> {
    const character = await this.prisma.character.findUnique({
      where: { userId },
    });

    if (!character) {
      throw new BadRequestException({ key: "err_character_not_found" });
    }

    const { pendingQi, isFull, secondsLeft } =
      this.calculatePendingQi(character);

    return {
      ...character,
      pendingQi,
      isStorageFull: isFull,
      storageSecondsLeft: secondsLeft,
    };
  }

  /**
   * 3. Метод сбора накопленной пассивной Ци
   */
  async claimQi(userId: string): Promise<CharacterWithPendingResponseDto> {
    const character = await this.prisma.character.findUnique({
      where: { userId },
    });

    if (!character) {
      throw new BadRequestException({ key: "err_character_not_found" });
    }

    const { pendingQi } = this.calculatePendingQi(character);

    if (pendingQi <= 0) {
      throw new BadRequestException({ key: "err_claim_too_early" });
    }

    // Начисляем Ци на баланс (exp) и обновляем таймер на текущее время
    const updatedCharacter = await this.prisma.character.update({
      where: { userId },
      data: {
        exp: character.exp + pendingQi,
        lastClaimAt: new Date(),
      },
    });

    return {
      ...updatedCharacter,
      pendingQi: 0,
      isStorageFull: false,
      storageSecondsLeft: MAX_AFK_TIME_MS / 1000,
    };
  }

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
