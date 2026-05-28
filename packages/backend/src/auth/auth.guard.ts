import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "./_telegram/telegram-tipes";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Token missing");
    }

    try {
      // Верифицируем токен. Секрет подтянется автоматически, если JwtModule настроен правильно
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      // Записываем payload (id, telegramId и т.д.) в объект запроса
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
