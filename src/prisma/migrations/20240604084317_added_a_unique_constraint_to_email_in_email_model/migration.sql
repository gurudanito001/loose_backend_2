/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Email` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Email_email_key" ON "Email"("email");
