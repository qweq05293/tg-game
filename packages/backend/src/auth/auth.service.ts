import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import {
  parseInitData,
  verifyTelegramInitData,
} from "./_telegram/telegram-auth.util";
import { JwtPayload, TelegramUser } from "./_telegram/telegram-tipes";

@Injectable()
export class AuthService {
  // Добавляем PrismaService в конструктор
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async telegramLogin(initData: string) {
    // Добавляем async, так как операции с БД асинхронны
    const botToken = this.configService.get<string>("BOT_TOKEN");
    const jwtSecret = this.configService.get<string>("JWT_SECRET");

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

    const tgUser = JSON.parse(data.user) as TelegramUser;

    // Сохраняем или обновляем пользователя в PostgreSQL
    const dbUser = await this.prisma.user.upsert({
      where: {
        telegramId: tgUser.id.toString(),
      },
      update: {
        username: tgUser.username || null,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name || null,
        languageCode: tgUser.language_code || null,
        allowsWriteToPm: tgUser.allows_write_to_pm || false,
        photoUrl: tgUser.photo_url || null,
      },
      create: {
        telegramId: tgUser.id.toString(),
        username: tgUser.username || null,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name || null,
        languageCode: tgUser.language_code || null,
        allowsWriteToPm: tgUser.allows_write_to_pm || false,
        photoUrl: tgUser.photo_url || null,
      },
    });

    // В payload токена теперь передаем внутренний id из базы данных (dbUser.id)
    const payload: JwtPayload = {
      id: dbUser.id,
      telegramId: dbUser.telegramId,
      username: dbUser.username,
      provider: "telegram",
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: dbUser,
    };
  }
}
