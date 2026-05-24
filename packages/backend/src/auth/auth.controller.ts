import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("telegram")
  login(@Body() body: { initData: string }) {
    return this.authService.telegramLogin(body.initData);
  }
}
