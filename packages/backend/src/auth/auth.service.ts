import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import {
  parseInitData,
  verifyTelegramInitData,
} from "./telegram/telegram-auth.util";
import { JwtPayload, TelegramUser } from "./telegram/telegram-tipes";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async telegramLogin(initData: string) {
    const botToken = this.configService.get<string>("BOT_TOKEN");
    const jwtSecret = this.configService.get<string>("JWT_SECRET");

    if (!botToken || !jwtSecret) {
      // Для ошибок сервера используем InternalServerErrorException (500) вместо базового Error
      throw new InternalServerErrorException("Missing env configuration");
    }

    // 1. Ошибка: пустые данные авторизации
    if (!initData) {
      throw new UnauthorizedException({ key: "err_auth_no_data" });
    }

    const data = parseInitData(initData);
    const authDate = Number(data.auth_date);

    // 2. Ошибка: сессия Telegram Mini App устарела (больше 24 часов)
    if (Date.now() / 1000 - authDate > 86400) {
      throw new UnauthorizedException({ key: "err_auth_expired" });
    }

    const isValid = verifyTelegramInitData(initData, botToken);

    // 3. Ошибка: поддельная или невалидная подпись данных Telegram
    if (!isValid) {
      throw new UnauthorizedException({ key: "err_auth_invalid_signature" });
    }

    const tgUser = JSON.parse(data.user) as TelegramUser;

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
