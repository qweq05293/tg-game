import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { MeditationController } from "./meditation.controller";
import { MeditationProcessor } from "./meditation.processor";
import { MeditationService } from "./meditation.service";

import { AuthModule } from "../auth/auth.module";
import { MEDITATION_QUEUE } from "./constants/meditation.constants";

@Module({
  imports: [
    BullModule.registerQueue({
      name: MEDITATION_QUEUE,
    }),
    AuthModule,
  ],
  controllers: [MeditationController],
  providers: [PrismaService, MeditationService, MeditationProcessor],
})
export class MeditationModule {}
