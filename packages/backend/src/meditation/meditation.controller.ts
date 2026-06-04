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

import { MeditationService } from "./meditation.service";

import {
  MeditationResponseDto,
  MeditationStateResponseDto,
  StartMeditationDto,
} from "./dto/start-meditation.dto";

@ApiTags("meditation")
@ApiBearerAuth()
@Controller("meditation")
@UseGuards(AuthGuard)
export class MeditationController {
  constructor(private readonly meditationService: MeditationService) {}

  @Get()
  @ApiOperation({
    summary: "Получить текущее состояние медитации",
  })
  @ApiOkResponse({
    type: MeditationStateResponseDto,
  })
  async getState(
    @CurrentUser() user: JwtPayload,
  ): Promise<MeditationStateResponseDto> {
    return this.meditationService.getState(user.id);
  }

  @Post("start")
  @ApiOperation({
    summary: "Начать медитацию",
  })
  @ApiOkResponse({
    type: MeditationResponseDto,
  })
  async start(
    @CurrentUser() user: JwtPayload,

    @Body()
    dto: StartMeditationDto,
  ): Promise<MeditationResponseDto> {
    return this.meditationService.start(user.id, dto);
  }

  @Post("cancel")
  @ApiOperation({
    summary: "Прервать медитацию",
  })
  @ApiOkResponse({
    type: MeditationResponseDto,
  })
  async cancel(
    @CurrentUser() user: JwtPayload,
  ): Promise<MeditationResponseDto> {
    return this.meditationService.cancel(user.id);
  }
}
