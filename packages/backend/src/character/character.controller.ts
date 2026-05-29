import { Body, Controller, Post, UseGuards } from "@nestjs/common";
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

  @Post("upgrade-stat")
  @ApiOperation({ summary: "Прокачка характеристик персонажа за Ци" })
  @ApiOkResponse({
    type: CharacterResponseDto, // Указываем класс ответа для Swagger/Orval
    description:
      "Характеристика успешно повышена, возвращен обновленный персонаж.",
  })
  async upgradeStat(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpgradeStatDto,
  ): Promise<CharacterResponseDto> {
    // Добавили строгий тип возвращаемого промиса
    return this.characterService.upgradeStat(user.id, dto);
  }

  @Post("breakthrough")
  @ApiOperation({
    summary: "Совершение ручного прорыва на следующую крупную стадию",
  })
  @ApiOkResponse({
    type: CharacterResponseDto, // Указываем класс ответа для Swagger/Orval
    description: "Персонаж совершил прорыв. Возвращен обновленный персонаж.",
  })
  async breakthrough(
    @CurrentUser() user: JwtPayload,
  ): Promise<CharacterResponseDto> {
    // Добавили строгий тип возвращаемого промиса
    return this.characterService.breakthrough(user.id);
  }
}
