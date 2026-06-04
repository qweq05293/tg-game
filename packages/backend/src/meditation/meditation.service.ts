import { BadRequestException, Injectable } from "@nestjs/common";

import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

import { PrismaService } from "../prisma/prisma.service";

import { MEDITATION_QUEUE } from "./constants/meditation.constants";

import {
  MeditationStateResponseDto,
  StartMeditationDto,
} from "./dto/start-meditation.dto";
import { MeditationJobName } from "./jobs/meditation-job-name.enum";

@Injectable()
export class MeditationService {
  constructor(
    private readonly prisma: PrismaService,

    @InjectQueue(MEDITATION_QUEUE)
    private readonly queue: Queue,
  ) {}

  async getState(characterId: string): Promise<MeditationStateResponseDto> {
    const meditation = await this.prisma.meditation.findUnique({
      where: {
        characterId,
      },
    });

    return {
      active: meditation?.status === "ACTIVE",
      meditation,
    };
  }

  async start(characterId: string, hours: StartMeditationDto) {
    const activeMeditation = await this.prisma.meditation.findUnique({
      where: {
        characterId,
      },
    });

    if (activeMeditation && activeMeditation.status === "ACTIVE") {
      throw new BadRequestException("Meditation already active");
    }

    const character = await this.prisma.character.findUniqueOrThrow({
      where: {
        id: characterId,
      },
    });

    const rewardExp =
      (character.spirit * 5 + character.stage * 10) * hours.hours;
    const rewardGold =
      (character.spirit * 2 + character.stage * 5) * hours.hours;

    const startedAt = new Date();

    const endsAt = new Date(startedAt.getTime() + hours.hours * 60 * 60 * 1000);

    const meditation = await this.prisma.meditation.upsert({
      where: {
        characterId,
      },

      create: {
        characterId,
        duration: hours.hours,
        rewardExp,
        rewardGold,
        startedAt,
        endsAt,
        status: "ACTIVE",
      },

      update: {
        duration: hours.hours,
        rewardExp,
        rewardGold,
        startedAt,
        endsAt,
        status: "ACTIVE",
      },
    });

    await this.queue.add(
      MeditationJobName.COMPLETE,
      {
        meditationId: meditation.id,
      },
      {
        delay: hours.hours * 60 * 60 * 1000,
      },
    );

    return meditation;
  }

  async cancel(characterId: string) {
    const meditation = await this.prisma.meditation.findUnique({
      where: {
        characterId,
      },
    });

    if (!meditation || meditation.status !== "ACTIVE") {
      throw new BadRequestException("No active meditation");
    }

    return this.prisma.meditation.update({
      where: {
        characterId,
      },
      data: {
        status: "CANCELLED",
      },
    });
  }
}
