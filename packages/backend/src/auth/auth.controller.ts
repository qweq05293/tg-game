import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { TelegramLoginRequestDto, TelegramLoginResponseDto } from "./_dto/dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("telegram")
  @ApiOkResponse({ type: TelegramLoginResponseDto })
  login(@Body() body: TelegramLoginRequestDto): Promise<TelegramLoginResponseDto> {
    return this.authService.telegramLogin(body.initData);
  }
}
