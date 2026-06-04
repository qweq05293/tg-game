import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { CharacterModule } from "./character/character.module";
import { envSchema } from "./config/env.schema";
import { MeditationModule } from "./meditation/meditation.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    PrismaModule,
    AuthModule,
    CharacterModule,
    MeditationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
