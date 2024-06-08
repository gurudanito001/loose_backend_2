/*
  Warnings:

  - Added the required column `userType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('listener', 'venter');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" "UserType" NOT NULL;

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "code" TEXT,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);
