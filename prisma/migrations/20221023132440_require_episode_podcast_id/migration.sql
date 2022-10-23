/*
  Warnings:

  - Made the column `podcastId` on table `Episode` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_podcastId_fkey";

-- AlterTable
ALTER TABLE "Episode" ALTER COLUMN "podcastId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
