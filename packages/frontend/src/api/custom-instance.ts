import { useAuthStore } from "@/store/useAuthStore";
import WebApp from "@twa-dev/sdk";
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { toast } from "sonner"; // Заменили импорт
import { BASE_URL } from "./env";

export const AXIOS_INSTANCE = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === "ERR_NETWORK") {
      try {
        WebApp.HapticFeedback.notificationOccurred("error");
      } catch (error) {
        console.error("Haptic feedback error:", error);
      }
      // Переделано под Sonner с описанием (description)
      toast.error("Проблема с сетью", {
        description: "Нет связи с сервером.",
      });
      return Promise.reject(error);
    }

    if (error.response && error.response.status >= 500) {
      // Переделано под Sonner с описанием (description)
      toast.error("Ошибка сервера", {
        description: "Сбой на бэкенде.",
      });
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return AXIOS_INSTANCE({ ...config, ...options }).then(
    (response: AxiosResponse<T>) => response.data,
  );
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<Body> = Body;
