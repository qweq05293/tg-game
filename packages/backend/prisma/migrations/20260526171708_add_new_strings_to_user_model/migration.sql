/*
  Warnings:

  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "allowsWriteToPm" BOOLEAN DEFAULT false,
ADD COLUMN     "languageCode" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ALTER COLUMN "firstName" SET NOT NULL;
