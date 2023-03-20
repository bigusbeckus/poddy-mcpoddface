import { logger } from "utils/logger";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "@/server/db/client";
import { ITUNES_PODCAST_LOOKUP_LINK } from "@/libs/itunes-podcast";
import { XMLParser } from "fast-xml-parser";
import { iTunesType, type Prisma } from "@prisma/client";
import { differenceInHours, differenceInMilliseconds, parse } from "date-fns";
import { EPISODE_FETCH_LIMIT } from "@/server/constants/limits";
import { EPISODE_DEFAULT_ORDER_BY } from "@/server/constants/order";
import { parseDurationSeconds } from "@/libs/util/converters";
import { createHash } from "crypto";
import { isIterable } from "@/libs/util/general";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function itemValid(item: any) {
  return (
    item &&
    item["title"] &&
    item["enclosure"] &&
    item["enclosure"]["@_url"] &&
    item["enclosure"]["@_length"] &&
    item["enclosure"]["@_type"]
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCategories(root: any, maxLevels = 5) {
  const categories: string[] = [];

  if (root) {
    if (root.__proto__ === String.prototype) {
      categories.push(root as string);
    } else if (root.length > 0 && maxLevels - 1 > 0) {
      root.forEach((entry: never) => categories.push(...getCategories(entry, maxLevels - 1)));
    } else {
      const textProp = root["@_text"];
      if (textProp) {
        categories.push(textProp as string);
      }
      if (maxLevels - 1 > 0) {
        categories.push(...getCategories(root["itunes:category"]));
      }
    }
  }

  return categories;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getChannelItem(item: any) {
  const durationIsNum = /^\d+$/.test(item["itunes:duration"]);

  if (!itemValid(item)) {
    return undefined;
  }

  const episode: Omit<Prisma.EpisodeCreateInput, "Podcast"> = {
    title: item["title"].toString(),
    url: item["enclosure"]["@_url"],
    length: parseInt(item["enclosure"]["@_length"]),
    type: item["enclosure"]["@_type"],
    guid:
      item["guid"] && item["guid"]["#text"]
        ? item["guid"]["#text"].toString()
        : createHash("sha256")
            .update(`${item["enclosure"]["@_url"]}-${item["title"]}}-${item["pubDate"] ?? ""}`)
            .digest("base64"),
    pubDate: item["pubDate"]
      ? parse(
          (() => {
            const fragments = item["pubDate"].split(" ");
            return `${fragments.slice(0, fragments.length - 1).join(" ")} +0000`;
          })(),
          "E, dd MMM yyyy HH:mm:ss xx",
          new Date()
        )
      : undefined,
    description: item["description"]?.toString(),
    itunesDuration: durationIsNum
      ? parseInt(item["itunes:duration"])
      : parseDurationSeconds(item["itunes:duration"]),
    link: item["link"]?.toString(),
    itunesImage: item["itunes:image"] ? item["itunes:image"]["@_href"] : undefined,
    itunesExplicit: item["itunes:explicit"] === "yes",
    itunesEpisode: item["itunes:episode"],
    itunesSeason: item["itunes:season"],
    itunesEpisodeType: item["itunes:episodetype"],
  };

  return episode;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = new Date();
  try {
    const { id } = req.body;
    // Ensure id exists
    if (!id) {
      return res.status(400).json({
        message: "Invalid inputs. Please provide an 'id' and try again.",
      });
    }

    // Check db for entry
    const dbResponse = await prisma.podcast.findUnique({
      where: {
        itunesCollectionId: id,
      },
      include: {
        episodes: {
          take: EPISODE_FETCH_LIMIT,
          orderBy: EPISODE_DEFAULT_ORDER_BY,
        },
        feedItunesCategories: true,
      },
    });

    // Respond if entry is found and is not stale
    if (dbResponse && differenceInHours(new Date(), dbResponse.createdAt) < 24) {
      const endTime = new Date();
      console.log(
        `Fetch ${dbResponse.feedTitle} completed in:`,
        differenceInMilliseconds(endTime, startTime),
        "ms"
      );
      return res.status(200).send(dbResponse);
    }

    // Lookup podcast if db entry hasn't been found or is stale
    const lookupResponse = (await axios.get(`${ITUNES_PODCAST_LOOKUP_LINK}&id=${id}`)).data;

    if (!(lookupResponse && lookupResponse.resultCount > 0)) {
      return res.status(404).json({
        message: "Podcast not found",
      });
    }
    const fetchedPodcast = lookupResponse.results[0];
    const feedResponse = (await axios.get(fetchedPodcast.feedUrl)).data;
    if (!feedResponse) {
      return res.status(410).json({
        message: "Failed to fetch podcast feed",
      });
    }

    // Parse podcast feed
    const parser = new XMLParser({
      ignoreAttributes: false,
    });
    const feed = parser.parse(feedResponse);
    const { channel } = feed.rss;

    // Cache podcast data
    const podcastData: Prisma.PodcastCreateInput = {
      id: dbResponse ? dbResponse.id : undefined,
      itunesWrapperType: fetchedPodcast.wrapperType,
      itunesKind: fetchedPodcast.kind,
      itunesArtistId: fetchedPodcast.artistId,
      itunesCollectionId: fetchedPodcast.collectionId,
      itunesTrackId: fetchedPodcast.trackId,
      itunesArtistName: fetchedPodcast.artistName,
      itunesCollectionName: fetchedPodcast.collectionName,
      itunesTrackName: fetchedPodcast.trackName,
      itunesFeedUrl: fetchedPodcast.feedUrl,
      itunesArtworkUrl30: fetchedPodcast.artworkUrl30,
      itunesArtworkUrl60: fetchedPodcast.artworkUrl60,
      itunesArtworkUrl100: fetchedPodcast.artworkUrl100,
      itunesArtworkUrl600: fetchedPodcast.artworkUrl600,
      itunesReleaseDate: fetchedPodcast.releaseDate,
      itunesCollectionExplicitness: fetchedPodcast.collectionExplicitness,
      itunesTrackExplicitness: fetchedPodcast.trackExplicitness,
      itunesTrackCount: fetchedPodcast.trackCount,
      itunesCountry: fetchedPodcast.country,
      itunesPrimaryGenreName: fetchedPodcast.primaryGenreName,
      itunesContentAdvisoryRating: fetchedPodcast.contentAdvisoryRating,
      itunesGenreIds: fetchedPodcast.genreIds,
      itunesGenres: lookupResponse.genres,
      feedTitle: channel.title.toString(),
      feedDescription: channel.description.toString(),
      feedItunesImage: channel["itunes:image"]["@_href"].toString(),
      feedLanguage: channel["language"].toString(),
      feedItunesExplicit: channel["itunes:explicit"] === "yes",
      feedItunesAuthor: channel["itunes:author"]?.toString(),
      feedItunesType:
        channel["itunes:type"] === "serial"
          ? iTunesType.SERIAL
          : channel["itunes:type"] === "episodic"
          ? iTunesType.EPISODIC
          : undefined,
      feedCopyright: channel["copyright"]?.toString(),
      feedNewUrl: channel["itunes:new-feed-url"]?.toString(),
      feedComplete: channel["itunes:complete"] === "yes",
      feedOwnerName: channel["itunes:owner"]
        ? channel["itunes:owner"]["itunes:name"]?.toString()
        : undefined,
      feedOwnerEmail: channel["itunes:owner"]
        ? channel["itunes:owner"]["itunes:email"]?.toString()
        : undefined,
    };

    const episodeData: Omit<Prisma.EpisodeCreateInput, "Podcast">[] = [];
    if (channel.item) {
      if (isIterable(channel.item)) {
        for (const item of channel.item) {
          const episode = getChannelItem(item);
          if (episode) {
            episodeData.push(episode);
          }
        }
      } else {
        const episode = getChannelItem(channel.item);
        if (episode) {
          episodeData.push(episode);
        }
      }
    }

    const feedCategories = [...new Set<string>(getCategories(channel["itunes:category"]))].map(
      (category) => ({
        where: {
          text: category,
        },
        create: {
          text: category,
        },
      })
    );

    const podcast = await prisma.podcast.upsert({
      create: {
        ...podcastData,
        episodes: {
          createMany: {
            data: episodeData,
            skipDuplicates: true,
          },
        },
        feedItunesCategories: {
          connectOrCreate: feedCategories,
        },
      },
      update: {
        ...podcastData,
        episodes: {
          upsert: episodeData.map(
            (episode) =>
              ({
                create: episode,
                update: episode as Prisma.EpisodeUpdateInput,
                where: episode.guid
                  ? {
                      guid: episode.guid,
                    }
                  : {
                      title_url_length: {
                        title: episode.title,
                        url: episode.url,
                        length: episode.length,
                      },
                    },
              } as Prisma.EpisodeUpsertWithWhereUniqueWithoutPodcastInput)
          ),
        },
        feedItunesCategories: {
          connectOrCreate: feedCategories,
        },
      },
      where: {
        itunesCollectionId: fetchedPodcast.collectionId,
      },
      include: {
        episodes: {
          take: EPISODE_FETCH_LIMIT,
          orderBy: EPISODE_DEFAULT_ORDER_BY,
        },
        feedItunesCategories: true,
      },
    });

    const endTime = new Date();
    console.log(
      `Fetch ${podcast.feedTitle} completed in:`,
      differenceInMilliseconds(endTime, startTime),
      "ms"
    );

    return res.status(200).send(podcast);
  } catch (error) {
    logger.error(error instanceof Error ? error.message : JSON.stringify(error));
    return res.status(400).json({
      message: "Podcast lookup failed",
      error: error ? error : "LOOKUP_ERROR",
    });
  }
}
