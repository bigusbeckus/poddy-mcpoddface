import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "../../../server/db/client";
import { ITUNES_PODCAST_LOOKUP_LINK } from "../../../libs/itunes-podcast";
import { XMLParser } from "fast-xml-parser";
import { iTunesType, Prisma } from "@prisma/client";
import { parse } from "date-fns";
import { EPISODE_FETCH_LIMIT } from "../../../server/constants/limits";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        },
      },
    });
    if (dbResponse) {
      return res.status(200).json({
        result: dbResponse,
      });
    }
    // Lookup podcast (db entry not found)
    const lookupResponse = (
      await axios.get(`${ITUNES_PODCAST_LOOKUP_LINK}&id=${id}`)
    ).data;

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
      feedTitle: channel.title,
      feedDescription: channel.description,
      feedItunesImage: channel["itunes:image"]["@_href"],
      feedLanguage: channel["language"],
      feedItunesCategory: channel["itunes:category"]["@_text"],
      feedItunesExplicit: channel["itunes:explicit"] === "yes",
      feedItunesAuthor: channel["itunes:author"],
      feedItunesType:
        channel["itunes:type"] === "serial"
          ? iTunesType.SERIAL
          : channel["itunes:type"] === "episodic"
          ? iTunesType.EPISODIC
          : undefined,
      feedCopyright: channel["copyright"],
      feedNewUrl: channel["itunes:new-feed-url"],
      feedComplete: channel["itunes:complete"] === "yes",
      feedOwnerName: channel["itunes:owner"]["itunes:name"],
      feedOwnerEmail: channel["itunes:owner"]["itunes:email"],
    };

    const episodeData: Prisma.EpisodeCreateInput = channel.item.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => {
        const episode: Omit<Prisma.EpisodeCreateInput, "Podcast"> = {
          title: item["title"],
          url: item["enclosure"]["@_url"],
          length: parseInt(item["enclosure"]["@_length"]),
          type: item["enclosure"]["@_type"],
          guid: item["guid"] ? item["guid"]["#text"] : undefined,
          pubDate: item["pubDate"]
            ? parse(
                (() => {
                  const fragments = item["pubDate"].split(" ");
                  return `${fragments
                    .slice(0, fragments.length - 1)
                    .join(" ")} +0000`;
                })(),
                "E, dd MMM yyyy HH:mm:ss xx",
                new Date()
              )
            : undefined,
          description: item["description"],
          itunesDuration: item["itunes:duration"],
          link: item["link"],
          itunesImage: item["itunes:image"]
            ? item["itunes:image"]["@_href"]
            : undefined,
          itunesExplicit: item["itunes:explicit"] === "yes",
          itunesEpisode: item["itunes:episode"],
          itunesSeason: item["itunes:season"],
          itunesEpisodeType: item["itunes:episodetype"],
        };
        return episode;
      }
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
      },
      update: {
        ...podcastData,
        episodes: {
          createMany: {
            data: episodeData,
            // skipDuplicates: true,
          },
        },
      },
      where: {
        itunesCollectionId: fetchedPodcast.collectionId,
      },
      include: {
        episodes: {
          take: EPISODE_FETCH_LIMIT,
        },
      },
    });
    if (podcast) {
      res.status(200).send(podcast);
    } else {
      res.status(500).json({
        message: "Server error: Unable to cache podcast",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "iTunes lookup failed",
      error: error ? error : "LOOKUP_ERROR",
    });
  }
}
