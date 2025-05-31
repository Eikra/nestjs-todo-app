/*
  Warnings:

  - You are about to drop the column `discription` on the `todos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "todos" DROP COLUMN "discription",
ADD COLUMN     "description" TEXT;
