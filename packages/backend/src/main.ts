import { NestFactory } from "@nestjs/core";
import dotenv from "dotenv";
import { AppModule } from "./app.module";
import { env } from "./config/env.schema";
dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = env.IS_DEV === "dev" ? true : [env.FRONTEND_URL];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = Number(env.PORT ?? 3000);

  await app.listen(port);
}

bootstrap().catch((err: unknown) => {
  console.error("Bootstrap failed:", err);
  process.exit(1);
});
