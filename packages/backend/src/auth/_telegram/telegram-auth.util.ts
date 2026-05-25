import * as crypto from "crypto";
export function parseInitData(initData: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(initData).entries());
}
export function buildDataCheckString(data: Record<string, string>): string {
  return Object.keys(data)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");
}
export function verifyTelegramInitData(
  initData: string,
  botToken: string,
): boolean {
  const data = parseInitData(initData);

  const hash = data.hash;
  if (!hash) return false;

  const checkString = buildDataCheckString(data);

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  return calculatedHash === hash;
}
