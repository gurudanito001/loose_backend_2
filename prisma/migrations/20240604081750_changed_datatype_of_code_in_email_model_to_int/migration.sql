/*
  Warnings:

  - Added the required column `code` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email" DROP COLUMN "code",
ADD COLUMN     "code" INTEGER NOT NULL;
