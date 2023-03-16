-- CreateTable
CREATE TABLE "TopPodcasts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "country" TEXT NOT NULL,
    "collectionIds" INTEGER[],

    CONSTRAINT "TopPodcasts_pkey" PRIMARY KEY ("id")
);
