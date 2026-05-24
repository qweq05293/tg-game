import { useEffect, useState } from "react";
import { telegramLogin } from "./lib/auth";

export function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    telegramLogin().then((loginData) => {
      setData(loginData);
    });
  }, []);
  if (!data) {
    return <div>Loading...</div>;
  }
  return <div>{JSON.stringify(data , null , 2)}</div>;
}

export default App;
