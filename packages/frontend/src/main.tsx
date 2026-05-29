import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@/components/theme-provider.tsx";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import "./i18n";
import i18n from "./i18n";
import "./index.css";
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        // Проверяем, пришел ли структурированный ответ с ключом перевода
        if (
          responseData &&
          typeof responseData === "object" &&
          "key" in responseData
        ) {
          const { key, args } = responseData as {
            key: string;
            args?: Record<string, unknown>;
          };

          // Локализуем ключ на фронтенде и выводим тост
          toast.error(i18n.t(key, args));
          return;
        }

        // Запасной вариант, если бэк вернул стандартную ошибку NestJS (например, валидация DTO)
        const message = responseData?.message || error.message;
        toast.error(Array.isArray(message) ? message[0] : message);
      }
    },
  }),
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/login"]}>
        <ThemeProvider>
          <App />
          <Toaster />
        </ThemeProvider>{" "}
      </MemoryRouter>
    </QueryClientProvider>
  </StrictMode>,
);
