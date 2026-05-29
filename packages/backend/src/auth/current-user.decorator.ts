import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { RequestWithUser } from "./telegram/telegram-tipes";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    // Безопасная проверка: если AuthGuard по какой-то причине не записал user
    if (!request.user) {
      throw new UnauthorizedException({ key: "err_token_invalid_or_expired" });
    }

    return request.user;
  },
);
