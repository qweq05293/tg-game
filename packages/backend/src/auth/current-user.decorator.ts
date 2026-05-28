import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RequestWithUser } from "./_telegram/telegram-tipes";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    return request.user;
  },
);
