import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const databaseUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;
export const envSchema = z.object({
  IS_DEV: z.enum(["dev", "prod"]),
  PORT: z.coerce.number().default(3000),
  BOT_TOKEN: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  DATABASE_URL: z.url().default(databaseUrl),
  FRONTEND_URL: z.url(),
});

export const env = envSchema.parse(process.env);

export type Env = typeof env;
