/*
  Warnings:

  - Added the required column `discordId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "discordId" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
