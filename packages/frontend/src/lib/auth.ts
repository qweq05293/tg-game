import WebApp from "@twa-dev/sdk";

export async function telegramLogin() {
  const BACK_BASE_URL = import.meta.env.VITE_BACK_BASE_URL;
  if (!BACK_BASE_URL) {
    throw new Error("BACK_BASE_URL is not defined in environment variables");
  }
  WebApp.ready();
  WebApp.expand();
  const initData = WebApp.initData;
  if (!initData) {
    throw new Error("No initData - not running inside Telegram WebApp");
  }
  const response = await fetch(`${BACK_BASE_URL}/auth/telegram`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initData,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw json;
  }

  return json;
}
