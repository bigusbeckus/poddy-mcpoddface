/*
  Warnings:

  - A unique constraint covering the columns `[podcastId,title,url,length]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Episode_title_url_length_key";

-- CreateIndex
CREATE UNIQUE INDEX "Episode_podcastId_title_url_length_key" ON "Episode"("podcastId", "title", "url", "length");
