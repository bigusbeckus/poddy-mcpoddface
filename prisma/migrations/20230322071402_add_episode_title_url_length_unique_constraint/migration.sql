/*
  Warnings:

  - A unique constraint covering the columns `[title,url,length]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.
  - Made the column `guid` on table `Episode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Episode" ALTER COLUMN "guid" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Episode_title_url_length_key" ON "Episode"("title", "url", "length");
