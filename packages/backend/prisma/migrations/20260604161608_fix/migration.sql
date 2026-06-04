/*
  Warnings:

  - A unique constraint covering the columns `[characterId]` on the table `Meditation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Meditation" DROP CONSTRAINT "Meditation_characterId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Meditation_characterId_key" ON "Meditation"("characterId");

-- AddForeignKey
ALTER TABLE "Meditation" ADD CONSTRAINT "Meditation_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
