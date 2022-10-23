-- AddExtension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateEnum
CREATE TYPE "iTunesType" AS ENUM ('EPISODIC', 'SERIAL');

-- CreateEnum
CREATE TYPE "EpisodeType" AS ENUM ('FULL', 'TRAILER', 'BONUS');

-- CreateTable
CREATE TABLE "Podcast" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "itunesWrapperType" TEXT NOT NULL,
    "itunesKind" TEXT NOT NULL,
    "itunesArtistId" INTEGER NOT NULL,
    "itunesCollectionId" INTEGER NOT NULL,
    "itunesTrackId" INTEGER NOT NULL,
    "itunesArtistName" TEXT NOT NULL,
    "itunesCollectionName" TEXT NOT NULL,
    "itunesTrackName" TEXT NOT NULL,
    "itunesFeedUrl" TEXT NOT NULL,
    "itunesArtworkUrl30" TEXT NOT NULL,
    "itunesArtworkUrl60" TEXT NOT NULL,
    "itunesArtworkUrl100" TEXT NOT NULL,
    "itunesArtworkUrl600" TEXT NOT NULL,
    "itunesReleaseDate" TIMESTAMP(3) NOT NULL,
    "itunesCollectionExplicitness" TEXT NOT NULL,
    "itunesTrackExplicitness" TEXT NOT NULL,
    "itunesTrackCount" INTEGER NOT NULL,
    "itunesCountry" TEXT NOT NULL,
    "itunesPrimaryGenreName" TEXT NOT NULL,
    "itunesContentAdvisoryRating" TEXT NOT NULL,
    "itunesGenreIds" TEXT[],
    "itunesGenres" TEXT[],
    "feedTitle" TEXT NOT NULL,
    "feedDescription" TEXT NOT NULL,
    "feedItunesImage" TEXT NOT NULL,
    "feedLanguage" TEXT NOT NULL,
    "feedItunesCategory" TEXT NOT NULL,
    "feedItunesExplicit" BOOLEAN NOT NULL,
    "feedItunesAuthor" TEXT,
    "feedLink" TEXT,
    "feedItunesType" "iTunesType",
    "feedCopyright" TEXT,
    "feedNewUrl" TEXT,
    "feedComplete" BOOLEAN NOT NULL DEFAULT false,
    "feedOwnerName" TEXT,
    "feedOwnerEmail" TEXT,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "guid" UUID,
    "pubDate" TIMESTAMP(3),
    "description" TEXT,
    "itunesDuration" TEXT,
    "link" TEXT,
    "itunesImage" TEXT,
    "itunesExplicit" BOOLEAN NOT NULL DEFAULT true,
    "itunesEpisode" INTEGER,
    "itunesSeason" INTEGER,
    "itunesEpisodeType" "EpisodeType" NOT NULL DEFAULT 'FULL',

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_itunesArtistId_key" ON "Podcast"("itunesArtistId");

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_itunesCollectionId_key" ON "Podcast"("itunesCollectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_itunesTrackId_key" ON "Podcast"("itunesTrackId");
