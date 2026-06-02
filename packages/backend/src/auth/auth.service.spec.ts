import {
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "./auth.service";
import * as telegramUtils from "./telegram/telegram-auth.util";

// Мокаем утилиты Telegram
jest.mock("./telegram/telegram-auth.util", () => ({
  parseInitData: jest.fn(),
  verifyTelegramInitData: jest.fn(),
}));

describe("AuthService (Unit)", () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  // 1. Создаем изолированную переменную для мока со строгим типом Jest
  let userUpsertMock: jest.Mock;

  const mockBotToken = "mock_bot_token";
  const mockJwtSecret = "mock_jwt_secret";
  const mockInitData =
    "user=%7B%22id%22%3A123%2C%22first_name%22%3A%22John%22%7D&auth_date=1600000000";

  const mockTelegramUser = {
    id: 123,
    username: "john_doe",
    first_name: "John",
    last_name: "Doe",
    language_code: "en",
    allows_write_to_pm: true,
    photo_url: "http://example.com",
  };

  // 2. Описываем структуру mockDbUser так, чтобы она удовлетворяла требованиям типов возврата Prisma
  const mockDbUser = {
    id: "uuid-123",
    telegramId: "123",
    username: "john_doe",
    firstName: "John",
    lastName: "Doe",
    languageCode: "en",
    allowsWriteToPm: true,
    photoUrl: "http://example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    // Инициализируем чистую функцию-пустышку перед каждым тестом
    userUpsertMock = jest.fn();

    const mockConfigService = { get: jest.fn() };
    const mockJwtService = { sign: jest.fn() };

    // Передаем наш явный мок вместо реальной Prisma
    const mockPrismaService = {
      user: {
        upsert: userUpsertMock,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get(ConfigService);
    jwtService = module.get(JwtService);

    configService.get.mockImplementation((key: string) => {
      if (key === "BOT_TOKEN") return mockBotToken;
      if (key === "JWT_SECRET") return mockJwtSecret;
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("telegramLogin", () => {
    it("should throw InternalServerErrorException if env variables are missing", async () => {
      configService.get.mockReturnValue(undefined);

      await expect(service.telegramLogin(mockInitData)).rejects.toThrow(
        new InternalServerErrorException("Missing env configuration"),
      );
    });

    it("should throw UnauthorizedException with key 'err_auth_no_data' if initData is empty", async () => {
      await expect(service.telegramLogin("")).rejects.toThrow(
        new UnauthorizedException({ key: "err_auth_no_data" }),
      );
    });

    it("should throw UnauthorizedException with key 'err_auth_expired' if session is older than 24h", async () => {
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 90000;
      (telegramUtils.parseInitData as jest.Mock).mockReturnValue({
        auth_date: expiredTimestamp.toString(),
      });

      await expect(service.telegramLogin(mockInitData)).rejects.toThrow(
        new UnauthorizedException({ key: "err_auth_expired" }),
      );
    });

    it("should throw UnauthorizedException with key 'err_auth_invalid_signature' if signature verification fails", async () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      (telegramUtils.parseInitData as jest.Mock).mockReturnValue({
        auth_date: currentTimestamp.toString(),
      });
      (telegramUtils.verifyTelegramInitData as jest.Mock).mockReturnValue(
        false,
      );

      await expect(service.telegramLogin(mockInitData)).rejects.toThrow(
        new UnauthorizedException({ key: "err_auth_invalid_signature" }),
      );
    });

    it("should successfully authenticate user, upsert character settings, and return token", async () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const mockToken = "generated_jwt_token";

      // Безопасно приводим типы моков утилит через unknown
      (telegramUtils.parseInitData as unknown as jest.Mock).mockReturnValue({
        auth_date: currentTimestamp.toString(),
        user: JSON.stringify(mockTelegramUser),
      });
      (
        telegramUtils.verifyTelegramInitData as unknown as jest.Mock
      ).mockReturnValue(true);

      userUpsertMock.mockResolvedValue(mockDbUser);

      // Используем spyOn для настройки возвращаемого значения, чтобы убрать ругань на .sign
      jest.spyOn(jwtService, "sign").mockReturnValue(mockToken);

      // Явно типизируем переменную result, чтобы убрать no-unsafe-assignment
      const result = await service.telegramLogin(mockInitData);

      expect(userUpsertMock).toHaveBeenCalledWith({
        where: { telegramId: mockTelegramUser.id.toString() },
        update: {
          username: mockTelegramUser.username,
          firstName: mockTelegramUser.first_name,
          lastName: mockTelegramUser.last_name,
          languageCode: mockTelegramUser.language_code,
          allowsWriteToPm: mockTelegramUser.allows_write_to_pm,
          photoUrl: mockTelegramUser.photo_url,
        },
        create: {
          telegramId: mockTelegramUser.id.toString(),
          username: mockTelegramUser.username,
          firstName: mockTelegramUser.first_name,
          lastName: mockTelegramUser.last_name,
          languageCode: mockTelegramUser.language_code,
          allowsWriteToPm: mockTelegramUser.allows_write_to_pm,
          photoUrl: mockTelegramUser.photo_url,
          character: {
            create: {
              name: `@${mockTelegramUser.username}`,
              stage: 1,
              level: 1,
              exp: 100,
              strength: 1,
              spirit: 1,
              agility: 1,
              constitution: 1,
              maxHp: 100,
              hp: 100,
              lastClaimAt: expect.any(Date) as Date,
            },
          },
        },
      });

      // Исправлено: проверяем вызов метода .sign через безопасный jest.spyOn
      expect(jest.spyOn(jwtService, "sign")).toHaveBeenCalledWith({
        id: mockDbUser.id,
        telegramId: mockDbUser.telegramId,
        username: mockDbUser.username,
        provider: "telegram",
      });

      expect(result).toEqual({
        token: mockToken,
        user: mockDbUser,
      });
    });

    it("should generate character fallback name if telegram username is missing", async () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const userWithoutUsername = { ...mockTelegramUser, username: undefined };

      // 1. Смягчаем приведение типов через unknown
      (telegramUtils.parseInitData as unknown as jest.Mock).mockReturnValue({
        auth_date: currentTimestamp.toString(),
        user: JSON.stringify(userWithoutUsername),
      });
      (
        telegramUtils.verifyTelegramInitData as unknown as jest.Mock
      ).mockReturnValue(true);
      userUpsertMock.mockResolvedValue(mockDbUser);

      await service.telegramLogin(mockInitData);

      // 2. Достаем первый аргумент первого вызова функции напрямую без цепочки any-объектов
      interface UpsertArgs {
        create: {
          character: {
            create: {
              name: string;
            };
          };
        };
      }

      // 2. Приводим массив calls к строгому типу массива кортежей (массива аргументов)
      const calls = userUpsertMock.mock.calls as unknown as [UpsertArgs][];

      // 3. Безопасно забираем первый аргумент [0] первого вызова [0]
      const firstCallArg = calls[0][0];

      // Проверяем сгенерированное имя персонажа без единой ошибки any
      expect(firstCallArg.create.character.create.name).toBe(
        "John's Character",
      );
    });
  });
});
