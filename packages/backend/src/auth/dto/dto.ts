import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

// Теперь этот DTO полностью повторяет структуру вашей таблицы User в PostgreSQL
export class DbUserDto {
  @ApiProperty({ example: "d3b07384-d113-4ec5-a5ae-7e2d72d698cf" })
  id!: string; // Наш внутренний UUID

  @ApiProperty({ example: "1287932964" })
  telegramId!: string;

  @ApiProperty({ required: false, nullable: true, example: "DKOTL" })
  username?: string | null;

  @ApiProperty({ example: "Dmitry" })
  firstName!: string;

  @ApiProperty({ required: false, nullable: true, example: "" })
  lastName?: string | null;

  @ApiProperty({ required: false, nullable: true, example: "en" })
  languageCode?: string | null;

  @ApiProperty({ required: false, example: true })
  allowsWriteToPm?: boolean | null;

  @ApiProperty({ required: false, nullable: true })
  photoUrl?: string | null;

  @ApiProperty({ example: "2026-05-26T17:45:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-05-26T17:45:00.000Z" })
  updatedAt!: Date;
}

export class TelegramLoginRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  initData!: string;
}

export class TelegramLoginResponseDto {
  @ApiProperty()
  token!: string;

  // Связываем ответ с нашей структурой из базы данных
  @ApiProperty({ type: DbUserDto })
  user!: DbUserDto;
}
