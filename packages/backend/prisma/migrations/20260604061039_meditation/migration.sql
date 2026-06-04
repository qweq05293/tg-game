-- CreateEnum
CREATE TYPE "MeditationStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Meditation" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "rewardExp" INTEGER NOT NULL,
    "rewardGold" INTEGER NOT NULL,
    "status" "MeditationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meditation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Meditation" ADD CONSTRAINT "Meditation_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
