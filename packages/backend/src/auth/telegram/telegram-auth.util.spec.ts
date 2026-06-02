import {
  parseInitData,
  buildDataCheckString,
  verifyTelegramInitData,
} from "./telegram-auth.util";
import * as crypto from "crypto";

describe("Telegram Auth Utilities (Unit)", () => {
  const mockBotToken = "123456:ABC-def_mock_bot_token";

  // Фейковые данные пользователя, как их присылает Telegram
  const mockUserString = JSON.stringify({
    id: 987654,
    first_name: "Alex",
    username: "alex_test",
  });
  const mockAuthDate = "1700000000";

  describe("parseInitData", () => {
    it("should transform URL query string into a flat key-value object", () => {
      const rawString = `user=${encodeURIComponent(mockUserString)}&auth_date=${mockAuthDate}&hash=somehash`;

      const result = parseInitData(rawString);

      expect(result).toEqual({
        user: mockUserString,
        auth_date: mockAuthDate,
        hash: "somehash",
      });
    });
  });

  describe("buildDataCheckString", () => {
    it("should filter out the hash key and sort all other keys alphabetically", () => {
      // Передаем ключи НЕ по алфавиту + подмешиваем hash
      const unorderedData = {
        user: "test_user",
        hash: "should_be_filtered_out",
        auth_date: "12345",
        allows_write_to_pm: "true",
      };

      const result = buildDataCheckString(unorderedData);

      // Ключи ДОЛЖНЫ отсортироваться: allows_write_to_pm -> auth_date -> user
      const expectedString =
        "allows_write_to_pm=true\nauth_date=12345\nuser=test_user";
      expect(result).toBe(expectedString);
    });
  });

  describe("verifyTelegramInitData", () => {
    // Вспомогательная функция для генерации математически верного хэша по вашему алгоритму
    function createValidTelegramString(
      data: Record<string, string>,
      token: string,
    ): string {
      // 1. Собираем проверочную строку с учетом вашей сортировки
      const checkString = Object.keys(data)
        .filter((key) => key !== "hash")
        .sort()
        .map((key) => `${key}=${data[key]}`)
        .join("\n");

      // 2. Генерируем реальный HMAC-SHA256
      const secretKey = crypto
        .createHmac("sha256", "WebAppData")
        .update(token)
        .digest();
      const hash = crypto
        .createHmac("sha256", secretKey)
        .update(checkString)
        .digest("hex");

      // 3. Формируем финальную query-строку
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(data)) {
        searchParams.append(key, value);
      }
      searchParams.append("hash", hash);

      return searchParams.toString();
    }

    it("should return true when signature matches Telegram requirements", () => {
      const baseData = {
        user: mockUserString,
        auth_date: mockAuthDate,
      };

      const validInitData = createValidTelegramString(baseData, mockBotToken);

      const isValid = verifyTelegramInitData(validInitData, mockBotToken);

      expect(isValid).toBe(true);
    });

    it("should return false if initData string does not contain a hash parameter", () => {
      const noHashData = `user=${encodeURIComponent(mockUserString)}&auth_date=${mockAuthDate}`;

      const isValid = verifyTelegramInitData(noHashData, mockBotToken);

      expect(isValid).toBe(false);
    });

    it("should return false if critical user data was manipulated by hacker", () => {
      const baseData = {
        user: mockUserString,
        auth_date: mockAuthDate,
      };
      const validInitData = createValidTelegramString(baseData, mockBotToken);

      // Хакер перехватил строку и подменил ID пользователя внутри JSON, но оставил старый хэш
      const tamperedInitData = validInitData.replace("987654", "666666");

      const isValid = verifyTelegramInitData(tamperedInitData, mockBotToken);

      expect(isValid).toBe(false);
    });

    it("should return false if validated against an incorrect bot token", () => {
      const baseData = {
        user: mockUserString,
        auth_date: mockAuthDate,
      };
      const validInitData = createValidTelegramString(baseData, mockBotToken);

      // Проверяем абсолютно валидную строку, но подставляем не тот токен бота
      const isValid = verifyTelegramInitData(
        validInitData,
        "WRONG_BOT_TOKEN_123",
      );

      expect(isValid).toBe(false);
    });
  });
});
