import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  parseInitData,
  verifyTelegramInitData,
} from "./_telegram/telegram-auth.util";
import { TelegramUser } from "./_telegram/telegram-tipes";
import { env } from "../config/env.schema";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  telegramLogin(initData: string) {
    const botToken = env.BOT_TOKEN;
    const jwtSecret = env.JWT_SECRET;

    if (!botToken || !jwtSecret) {
      throw new Error("Missing env vars");
    }

    if (!initData) {
      throw new UnauthorizedException("No initData");
    }

    const data = parseInitData(initData);
    const authDate = Number(data.auth_date);

    if (Date.now() / 1000 - authDate > 86400) {
      throw new UnauthorizedException("InitData expired");
    }
    const isValid = verifyTelegramInitData(initData, botToken);

    if (!isValid) {
      throw new UnauthorizedException("Invalid Telegram signature");
    }

    const user = JSON.parse(data.user) as TelegramUser;

    const token = this.jwtService.sign(
      {
        sub: user.id,
        username: user.username,
        provider: "telegram",
      },
      {
        secret: jwtSecret,
        expiresIn: "7d",
      },
    );

    return {
      token,
      user,
    };
  }
}
