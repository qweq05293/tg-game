import { Job } from "bullmq";

import { Processor, WorkerHost } from "@nestjs/bullmq";

import { PrismaService } from "../prisma/prisma.service";

import { MEDITATION_QUEUE } from "./constants/meditation.constants";

import { CompleteMeditationJobData } from "./jobs/meditation-job-data";
import { MeditationJobName } from "./jobs/meditation-job-name.enum";

@Processor(MEDITATION_QUEUE)
export class MeditationProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<CompleteMeditationJobData>) {
    switch (job.name as MeditationJobName) {
      case MeditationJobName.COMPLETE:
        await this.completeMeditation(job.data);
        break;
    }
  }

  private async completeMeditation(data: CompleteMeditationJobData) {
    const meditation = await this.prisma.meditation.findUnique({
      where: {
        id: data.meditationId,
      },
    });

    if (!meditation) {
      return;
    }

    if (meditation.status !== "ACTIVE") {
      return;
    }

    await this.prisma.$transaction([
      this.prisma.character.update({
        where: {
          id: meditation.characterId,
        },
        data: {
          exp: {
            increment: meditation.rewardExp,
          },
        },
      }),

      this.prisma.meditation.update({
        where: {
          id: meditation.id,
        },
        data: {
          status: "COMPLETED",
        },
      }),
    ]);
  }
}
