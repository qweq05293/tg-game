import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import dotenv from "dotenv";
import { AppModule } from "./app.module";
import { env } from "./config/env.schema";
import { ValidationPipe } from "@nestjs/common";
dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = env.IS_DEV === "dev" ? true : [env.FRONTEND_URL];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle("TG Game API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = Number(env.PORT ?? 3000);

  await app.listen(port);
}

bootstrap().catch((err: unknown) => {
  console.error("Bootstrap failed:", err);
  process.exit(1);
});
