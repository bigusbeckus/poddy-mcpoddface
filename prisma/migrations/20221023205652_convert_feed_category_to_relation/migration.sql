-- CreateTable
CREATE TABLE "iTunesCategory" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,

    CONSTRAINT "iTunesCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PodcastToiTunesCategory" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "iTunesCategory_text_key" ON "iTunesCategory"("text");

-- CreateIndex
CREATE UNIQUE INDEX "_PodcastToiTunesCategory_AB_unique" ON "_PodcastToiTunesCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_PodcastToiTunesCategory_B_index" ON "_PodcastToiTunesCategory"("B");

-- AddForeignKey
ALTER TABLE "_PodcastToiTunesCategory" ADD CONSTRAINT "_PodcastToiTunesCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PodcastToiTunesCategory" ADD CONSTRAINT "_PodcastToiTunesCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "iTunesCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- MigrateExistingCategories
INSERT INTO "iTunesCategory"("text") SELECT "feedItunesCategory" as "text" FROM "Podcast" GROUP BY "feedItunesCategory";
INSERT INTO "_PodcastToiTunesCategory" SELECT "Podcast"."id" AS "A", "iTunesCategory"."id" AS "B" FROM "Podcast" JOIN "iTunesCategory" ON "Podcast"."feedItunesCategory" = "iTunesCategory"."text";
