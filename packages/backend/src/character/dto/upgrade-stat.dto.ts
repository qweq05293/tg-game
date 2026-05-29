import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class UpgradeStatDto {
  @IsString()
  @IsIn(["strength", "spirit", "agility", "constitution"])
  statName!: "strength" | "spirit" | "agility" | "constitution";
}
export class CharacterResponseDto {
  @ApiProperty({
    example: "clux1234567890",
    description: "Уникальный ID персонажа",
  })
  id!: string;

  @ApiProperty({
    example: "user_id_from_db",
    description: "ID владельца персонажа",
  })
  userId!: string;

  @ApiProperty({ example: 1, description: "Текущая стадия прорыва (Stage)" })
  stage!: number;

  @ApiProperty({
    example: 1,
    description: "Текущий слой внутри стадии (Level)",
  })
  level!: number;

  @ApiProperty({ example: 0, description: "Текущее количество Ци (Exp)" })
  exp!: number;

  @ApiProperty({ example: 10, description: "Сила (Strength)" })
  strength!: number;

  @ApiProperty({ example: 10, description: "Дух (Spirit)" })
  spirit!: number;

  @ApiProperty({ example: 10, description: "Ловкость (Agility)" })
  agility!: number;

  @ApiProperty({ example: 10, description: "Телосложение (Constitution)" })
  constitution!: number;

  @ApiProperty({ example: 100, description: "Максимальное здоровье" })
  maxHp!: number;

  @ApiProperty({ example: 100, description: "Текущее здоровье" })
  hp!: number;

  @ApiProperty({ description: "Дата создания" })
  createdAt!: Date;

  @ApiProperty({ description: "Дата обновления" })
  updatedAt!: Date;
}
