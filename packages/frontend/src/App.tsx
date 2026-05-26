import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useAuthControllerLogin } from "./api/auth/auth";

export default function App() {
  // Хук возвращает функцию для старта (mutate), состояние загрузки и данные ответа
  const { mutate, data, isPending, error } = useAuthControllerLogin();

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    const initData = WebApp.initData;
    console.log("initData", initData);
    if (initData) {
      mutate({ data: { initData } });
    }
  }, [mutate]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <div>
      <h1>Authenticated!</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
