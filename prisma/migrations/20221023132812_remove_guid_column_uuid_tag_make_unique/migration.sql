/*
  Warnings:

  - A unique constraint covering the columns `[guid]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Episode" ALTER COLUMN "guid" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Episode_guid_key" ON "Episode"("guid");
