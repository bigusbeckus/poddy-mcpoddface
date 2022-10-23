/*
  Warnings:

  - The `itunesDuration` column on the `Episode` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "itunesDuration",
ADD COLUMN     "itunesDuration" INTEGER;
