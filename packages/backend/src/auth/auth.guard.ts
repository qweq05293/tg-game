import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "./telegram/telegram-tipes";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const token = this.extractTokenFromHeader(request);

    // 1. Ошибка: Токен полностью отсутствует в заголовках
    if (!token) {
      throw new UnauthorizedException({ key: "err_token_missing" });
    }

    try {
      // Верифицируем токен
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      // Записываем payload в объект запроса
      request.user = payload;
    } catch {
      // 2. Ошибка: Токен подделан, поврежден или его срок действия истек
      throw new UnauthorizedException({ key: "err_token_invalid_or_expired" });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
