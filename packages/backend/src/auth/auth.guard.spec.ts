import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "./auth.guard";
import { JwtPayload, RequestWithUser } from "./telegram/telegram-tipes";

describe("AuthGuard (Unit)", () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<JwtService>;

  // Заготовка правильного payload
  const mockPayload: JwtPayload = {
    id: "uuid-123",
    telegramId: "12345",
    username: "test_user",
    provider: "telegram",
  };

  // Вспомогательная функция для создания фальшивого контекста выполнения NestJS
  // Она имитирует объект HTTP-запроса (Request)
  function createMockContext(
    this: void,
    authHeader?: string,
  ): ExecutionContext {
    const mockRequest = {
      headers: {
        authorization: authHeader,
      },
      user: undefined, // Сюда гвард должен записать payload
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;
  }

  beforeEach(async () => {
    const mockJwtService = {
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, { provide: JwtService, useValue: mockJwtService }],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should return true and attach user to request if token is valid Bearer", async () => {
    const context = createMockContext("Bearer valid_token_string");

    // Настраиваем JwtService на успешное декодирование токена
    jwtService.verifyAsync.mockResolvedValue(mockPayload);

    const result = await guard.canActivate(context);

    // 1. Гвард должен разрешить доступ (вернуть true)
    expect(result).toBe(true);

    // 2. В JwtService должен передаться чистый токен (без слова Bearer)
    // Линтер будет полностью доволен, так как контекст объекта сохраняется
    expect(jest.spyOn(jwtService, "verifyAsync")).toHaveBeenCalledWith(
      "valid_token_string",
    );

    // 3. Данные пользователя должны успешно прикрепиться к объекту запроса
    const req: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();
    expect(req.user).toEqual(mockPayload);
  });

  it("should throw UnauthorizedException with key 'err_token_missing' if header is missing", async () => {
    const context = createMockContext(undefined); // Заголовок авторизации пустой

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException({ key: "err_token_missing" }),
    );
  });

  it("should throw UnauthorizedException with key 'err_token_missing' if token type is not Bearer", async () => {
    const context = createMockContext("Basic encoded_credentials"); // Неверный тип токена

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException({ key: "err_token_missing" }),
    );
  });

  it("should throw UnauthorizedException with key 'err_token_invalid_or_expired' if jwt verification fails", async () => {
    const context = createMockContext("Bearer expired_or_bad_token");

    // Имитируем ошибку валидации (например, срок токена истек)
    jwtService.verifyAsync.mockRejectedValue(new Error("jwt expired"));

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException({ key: "err_token_invalid_or_expired" }),
    );
  });
});
