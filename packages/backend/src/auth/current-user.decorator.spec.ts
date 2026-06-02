import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { CurrentUser } from "./current-user.decorator";
import { JwtPayload } from "./telegram/telegram-tipes";

// 1. Описываем строгие интерфейсы для метаданных NestJS
interface NestRouteParamMetadata {
  factory: (data: unknown, context: ExecutionContext) => unknown;
}

type NestRouteMetadataRecord = Record<string, NestRouteParamMetadata>;

// Вспомогательная функция, которая достает чистую фабрику из декоратора параметров NestJS
function getParamDecoratorFactory(
  // Указываем, что на входе функция-фабрика декоратора, возвращающая ParameterDecorator
  decorator: () => ParameterDecorator,
): (data: unknown, context: ExecutionContext) => unknown {
  class TestController {
    // Вызываем декоратор через скобки (), чтобы NestJS прописал метаданные.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    testMethod(@decorator() _: unknown) {}
  }

  // Извлекаем и типизируем метаданные рефлексии через unknown
  const metadata = Reflect.getMetadata(
    ROUTE_ARGS_METADATA,
    TestController,
    "testMethod",
  ) as unknown as NestRouteMetadataRecord;

  const key = Object.keys(metadata)[0];
  return metadata[key].factory;
}

describe("CurrentUser Decorator (Unit)", () => {
  let factory: (data: unknown, context: ExecutionContext) => unknown;

  const mockUser: JwtPayload = {
    id: "uuid-123",
    telegramId: "987654321",
    username: "alex_test",
    provider: "telegram",
  };

  function createMockContext(userPayload?: JwtPayload): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user: userPayload,
        }),
      }),
    } as unknown as ExecutionContext;
  }

  beforeAll(() => {
    // Приводим к типу функции-фабрики декоратора для совместимости с getParamDecoratorFactory
    factory = getParamDecoratorFactory(CurrentUser);
  });

  it("should successfully return the user object if it exists in the request", () => {
    const context = createMockContext(mockUser);

    const result = factory(undefined, context);

    expect(result).toEqual(mockUser);
  });

  it("should throw UnauthorizedException with key 'err_token_invalid_or_expired' if request.user is missing", () => {
    const context = createMockContext(undefined);

    expect(() => factory(undefined, context)).toThrow(
      new UnauthorizedException({ key: "err_token_invalid_or_expired" }),
    );
  });
});
