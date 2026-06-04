/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Meditation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Meditation" DROP COLUMN "createdAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
