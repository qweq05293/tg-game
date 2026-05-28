export type TelegramInitDataParsed = {
  user?: TelegramUser;
  chat_instance?: string;
  chat_type?: string;
  auth_date: number;
  hash: string;
  signature?: string;
};

export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  allows_write_to_pm?: boolean;
};
export interface JwtPayload {
  id: string;
  telegramId: string;
  username?: string | null;
  provider: "telegram";
}

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}
