/*
  Warnings:

  - You are about to drop the column `lastExpClaimAt` on the `Character` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "lastExpClaimAt",
ADD COLUMN     "lastClaimAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
