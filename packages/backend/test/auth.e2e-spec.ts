import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "child_process";
import * as crypto from "crypto";
import request from "supertest"; // Убедитесь, что этот импорт работает (или используйте ваш рабочий вариант)
import { AppModule } from "../src/app.module";
import { buildDataCheckString } from "../src/auth/telegram/telegram-auth.util";
import { JwtPayload } from "../src/auth/telegram/telegram-tipes";
import { PrismaService } from "../src/prisma/prisma.service";

// 1. Создаем строгий интерфейс ответа бэкенда для ESLint
interface ValidAuthResponse {
  token: string;
  user: {
    id: string;
    telegramId: string;
    username: string | null;
    firstName: string;
  };
}

interface ErrorAuthResponse {
  error: string;
  message: any;
  statusCode: number;
}

describe("AuthController (Integration - E2E with Testcontainers)", () => {
  let app: INestApplication;
  let container: StartedPostgreSqlContainer;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const testBotToken = "123456:ABC-def_mock_bot_token";
  const testJwtSecret = "super_secret_test_jwt_key_123";

  // Хелпер для генерации строки
  function generateValidTelegramInitData(
    userId: number,
    username: string | null = "john_test",
  ): string {
    const user = {
      id: userId,
      first_name: "John",
      ...(username && { username }),
    };
    const authDate = Math.floor(Date.now() / 1000).toString();
    const userJsonString = JSON.stringify(user);
    const checkString = buildDataCheckString({
      auth_date: authDate,
      user: userJsonString,
    });
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(testBotToken)
      .digest();
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(checkString)
      .digest("hex");
    return `auth_date=${authDate}&user=${encodeURIComponent(userJsonString)}&hash=${hash}`;
  }

  beforeAll(async () => {
    jest.setTimeout(60000);

    process.env.BOT_TOKEN = testBotToken;
    process.env.JWT_SECRET = testJwtSecret;

    container = await new PostgreSqlContainer("postgres:15-alpine")
      .withDatabase("game_test_db")
      .withUsername("game_test_user")
      .withPassword("game_test_password")
      .start();

    const dbUrl = `postgresql://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getMappedPort(5432)}/${container.getDatabase()}`;
    process.env.DATABASE_URL = dbUrl;

    execSync("npx prisma migrate deploy", {
      env: { ...process.env, DATABASE_URL: dbUrl },
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) => {
          if (key === "BOT_TOKEN") return testBotToken;
          if (key === "JWT_SECRET") return testJwtSecret;
          return process.env[key];
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
  }, 60000);

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE;`);
  });

  afterAll(async () => {
    if (prisma) await prisma.$disconnect();
    if (app) await app.close();
    if (container) await container.stop();
  });

  describe("POST /auth/telegram", () => {
    it("should register a new user, create their starting game character, and return working JWT token", async () => {
      const telegramUserId = 777888999;
      const validInitData = generateValidTelegramInitData(
        telegramUserId,
        "iron_man",
      );

      // 2. Явно типизируем сервер через неизвестный тип (unknown), чтобы убрать ошибку 'Unsafe argument type any'
      const server = app.getHttpServer() as unknown as string;

      const response = await request(server)
        .post("/auth/telegram")
        .send({ initData: validInitData })
        .expect(201);

      // 3. Принудительно приводим body к нашему строгому интерфейсу
      const body = response.body as ValidAuthResponse;

      expect(body).toHaveProperty("token");
      expect(body).toHaveProperty("user");
      expect(body.user.username).toBe("iron_man");

      const dbUser = await prisma.user.findUnique({
        where: { telegramId: telegramUserId.toString() },
        include: { character: true },
      });

      expect(dbUser).toBeDefined();
      expect(dbUser?.telegramId).toBe(telegramUserId.toString());
      expect(dbUser?.character).toBeDefined();
      expect(dbUser?.character?.name).toBe("@iron_man");
      expect(dbUser?.character?.exp).toBe(100);
      expect(dbUser?.character?.level).toBe(1);

      // Передаем секрет вторым аргументом, как в вашем рабочем решении
      const decodedPayload: JwtPayload = await jwtService.verifyAsync(
        body.token,
        {
          secret: testJwtSecret,
        },
      );
      expect(decodedPayload.id).toBe(dbUser?.id);
      expect(decodedPayload.telegramId).toBe(dbUser?.telegramId);
    });

    it("should correctly fallback to default character name if telegram username is absent", async () => {
      const telegramUserId = 111222333;
      const initDataWithoutUsername = generateValidTelegramInitData(
        telegramUserId,
        null,
      );
      const server = app.getHttpServer() as unknown as string;

      await request(server)
        .post("/auth/telegram")
        .send({ initData: initDataWithoutUsername })
        .expect(201);

      const dbUser = await prisma.user.findUnique({
        where: { telegramId: telegramUserId.toString() },
        include: { character: true },
      });

      expect(dbUser?.character?.name).toBe("John's Character");
    });

    it("should return 401 Unauthorized if hacker provides invalid hmac signature", async () => {
      const validInitData = generateValidTelegramInitData(12345);
      const tamperedInitData = validInitData.replace("hash=", "hash=fake_");
      const server = app.getHttpServer() as unknown as string;

      const response = await request(server)
        .post("/auth/telegram")
        .send({ initData: tamperedInitData })
        .expect(401);

      // Сверяем объект ошибки напрямую в корне ответа
      expect(response.body).toEqual({
        key: "err_auth_invalid_signature",
      });

      const usersInDbCount = await prisma.user.count();
      expect(usersInDbCount).toBe(0);
    });

    it("should return 400 Bad Request if initData is missing in request body due to DTO validation", async () => {
      const server = app.getHttpServer() as unknown as string;

      const response = await request(server)
        .post("/auth/telegram")
        .send({})
        .expect(400);

      const body = response.body as ErrorAuthResponse;
      expect(body.error).toBe("Bad Request");
    });
  });
});
