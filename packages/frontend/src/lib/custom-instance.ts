import Axios, { type AxiosRequestConfig, type AxiosError } from 'axios';
import { BACK_URL } from './env';

// Локальная переменная для хранения функции роутера
let axiosNavigate: ((path: string, options?: { replace?: boolean }) => void) | null = null;

// Функция, которую мы вызываем в App.tsx для связи роутера и Axios
export const injectNavigate = (navigateFn: typeof axiosNavigate) => {
  axiosNavigate = navigateFn;
};

export const AXIOS_INSTANCE = Axios.create({
  baseURL: BACK_URL,
});

// Response interceptor
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const method = error.config?.method?.toLowerCase();

    // 1. Обработка 401 Unauthorized
    if (status === 401) {
      if (axiosNavigate) {
        axiosNavigate('/login', { replace: true });
      } else {
        window.location.href = '/login'; // Фолбэк, если роутер еще не инициализировался
      }
      return Promise.reject(error);
    }

    // 2. Обработка 404 Not Found
    if (status === 404) {
      // Редиректим только безопасные GET-запросы на получение данных
      if (method === 'get') {
        if (axiosNavigate) {
          axiosNavigate('/404');
        } else {
          window.location.href = '/404';
        }
      }
    }

    return Promise.reject(error);
  },
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data);
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
