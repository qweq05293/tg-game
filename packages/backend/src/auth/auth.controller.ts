import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { TelegramLoginResponseDto } from "./_dto/dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("telegram")
  @ApiOkResponse({ type: TelegramLoginResponseDto })
  login(@Body() body: { initData: string }): TelegramLoginResponseDto {
    return this.authService.telegramLogin(body.initData);
  }
}
