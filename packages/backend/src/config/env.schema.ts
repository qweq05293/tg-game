import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
export const envSchema = z.object({
  IS_DEV: z.enum(["dev", "prod"]),
  PORT: z.coerce.number().default(3000),
  BOT_TOKEN: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  FRONTEND_URL: z.url(),
});

export const env = envSchema.parse(process.env);

export type Env = typeof env;
