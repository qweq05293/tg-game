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
}
