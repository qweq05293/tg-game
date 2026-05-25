import { useEffect, useState } from "react";
import { telegramLogin } from "./lib/auth";
import type { TelegramLoginResponseDto } from "./shared/api";

export function App() {
  const [data, setData] = useState<TelegramLoginResponseDto | null>(null);

  useEffect(() => {
    telegramLogin().then((loginData) => {
      setData(loginData);
    });
  }, []);
  if (!data) {
    return <div>Loading...</div>;
  }
  return <div>{JSON.stringify(data, null, 2)}</div>;
}

export default App;
