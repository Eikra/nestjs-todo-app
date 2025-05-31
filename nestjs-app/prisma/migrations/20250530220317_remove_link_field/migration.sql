/*
  Warnings:

  - You are about to drop the column `link` on the `todos` table. All the data in the column will be lost.
  - Made the column `description` on table `todos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "todos" DROP COLUMN "link",
ALTER COLUMN "description" SET NOT NULL;
