import { NextApiRequest, NextApiResponse } from "next";
import { podcastFeedLink } from "../../../libs/itunes-podcast";
import { prisma } from "../../../server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Set country
    const country =
      req.query.country && req.query.country instanceof String
        ? req.query.country.toLowerCase()
        : "us";
    // Set fetch limit
    const parsedLimit = parseInt(
      req.query.limit ? req.query.limit.toString() : ""
    );
    const limit = isNaN(parsedLimit) ? 10 : parsedLimit;

    // Fetch top list
    let feedEntry = await prisma.topPodcasts.findUnique({
      where: {
        country: country,
      },
    });

    if (!feedEntry) {
      const topList = await podcastFeedLink()
        .country(country)
        .limit(100)
        .fetch();
      const entry = {
        country,
        collectionIds: topList.results.map((item) => item.id),
      };
      feedEntry = await prisma.topPodcasts.upsert({
        create: entry,
        update: entry,
        where: {
          country,
        },
      });
    }

    res.status(200).json({
      createdAt: feedEntry.createdAt,
      country: feedEntry.country,
      collectionIds: feedEntry.collectionIds.slice(0, limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}
