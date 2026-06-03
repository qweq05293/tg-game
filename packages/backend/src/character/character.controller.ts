import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { JwtPayload } from "../auth/telegram/telegram-tipes";
import { CharacterService } from "./character.service";
import { CharacterResponseDto, UpgradeStatDto } from "./dto/upgrade-stat.dto";

@ApiTags("character")
@ApiBearerAuth()
@Controller("character")
@UseGuards(AuthGuard)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get("me")
  @ApiOperation({
    summary: "Получить профиль персонажа с учетом накопленной Ци",
  })
  @ApiOkResponse({ type: CharacterResponseDto }) // Используем расширенное DTO
  async getMe(@CurrentUser() user: JwtPayload): Promise<CharacterResponseDto> {
    return this.characterService.getCharacter(user.id);
  }

  @Post("upgrade-stat")
  @ApiOperation({ summary: "Прокачка характеристик персонажа за Ци" })
  @ApiOkResponse({ type: CharacterResponseDto }) // Чистый персонаж без AFK-полей
  async upgradeStat(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpgradeStatDto,
  ): Promise<CharacterResponseDto> {
    return this.characterService.upgradeStat(user.id, dto);
  }

  @Post("breakthrough")
  @ApiOperation({
    summary: "Совершение ручного прорыва на следующую крупную стадию",
  })
  @ApiOkResponse({ type: CharacterResponseDto }) // Чистый персонаж без AFK-полей
  async breakthrough(
    @CurrentUser() user: JwtPayload,
  ): Promise<CharacterResponseDto> {
    return this.characterService.breakthrough(user.id);
  }
}
