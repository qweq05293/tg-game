import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class UpgradeStatDto {
  @IsString()
  @IsIn(["strength", "spirit", "agility", "constitution"])
  statName!: "strength" | "spirit" | "agility" | "constitution";
}

// 1. Базовый тип персонажа (для прокачки и прорыва)
export class CharacterResponseDto {
  @ApiProperty({ example: "id123" }) id!: string;
  @ApiProperty({ example: "user123" }) userId!: string;
  @ApiProperty({ example: 1 }) stage!: number;
  @ApiProperty({ example: 1 }) level!: number;
  @ApiProperty({ example: 0 }) exp!: number;
  @ApiProperty({ example: 10 }) strength!: number;
  @ApiProperty({ example: 10 }) spirit!: number;
  @ApiProperty({ example: 10 }) agility!: number;
  @ApiProperty({ example: 10 }) constitution!: number;
  @ApiProperty({ example: 100 }) maxHp!: number;
  @ApiProperty({ example: 100 }) hp!: number;
  @ApiProperty({ example: "2026-05-29T19:19:11.000Z" }) lastClaimAt!: Date;
}

// 2. Расширенный тип персонажа (ТОЛЬКО для получения профиля и сбора Ци)
export class CharacterWithPendingResponseDto extends CharacterResponseDto {
  @ApiProperty({ example: 150, description: "Накопленная Ци, готовая к сбору" })
  pendingQi!: number;

  @ApiProperty({
    example: false,
    description: "Заполнен ли склад пассивного дохода",
  })
  isStorageFull!: boolean;

  @ApiProperty({
    example: 28800,
    description: "Сколько секунд осталось до полного заполнения склада",
  })
  storageSecondsLeft!: number;
}
