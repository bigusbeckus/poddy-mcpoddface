import { Prisma } from "@prisma/client";
import axios from "axios";
import { clampInt } from "./util/number";

export const ITUNES_PODCAST_SEARCH_LINK =
  "https://itunes.apple.com/search?media=podcast";
export const ITUNES_PODCAST_LOOKUP_LINK =
  "https://itunes.apple.com/lookup?&entity=podcast";
export const ITUNES_RSS_FEED_LINK =
  "https://rss.applemarketingtools.com/api/v2";

export type PodcastSearchResult = {
  wrapperType: string;
  kind: string;
  artistId: number;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
  feedUrl: string;
  trackViewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  trackPrice: number;
  trackRentalPrice: number;
  collectionHdPrice: number;
  trackHdPrice: number;
  trackHdRentalPrice: number;
  releaseDate: Date;
  collectionExplicitness: string;
  trackExplicitness: string;
  trackCount: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  contentAdvisoryRating: string;
  artworkUrl600: string;
  genreIds: string[];
  genres: string[];
};

export type SearchReturn = {
  resultCount: number;
  results: PodcastSearchResult[];
};

export type PodcastFeedResult = {
  id: number;
  artistName: string;
  name: string;
  kind: string;
  artworkUrl100: string;
  genres: string[];
};

export type FeedReturn = {
  title: string;
  country: string;
  updated: string;
  results: PodcastFeedResult[];
};

enum FeedType {
  top,
  topSubscriber,
}

enum FeedSubject {
  podcasts,
  podcastEpisodes,
  podcastChannels,
}

export function podcastFeedLink() {
  let _country: string | undefined;
  let _type = FeedType.top;
  let _subject = FeedSubject.podcasts;
  let _limit = 10;

  function country(country: string) {
    _country = country;
    return obj;
  }
  function type(type: FeedType) {
    _type = type;
    return obj;
  }
  function subject(subject: FeedSubject) {
    _subject = subject;
    return obj;
  }
  function limit(limit: number) {
    _limit = clampInt(limit, 1, 100);
    return obj;
  }

  function getLink() {
    let linkEnd = "";

    if (_subject === FeedSubject.podcastEpisodes) {
      _type = FeedType.top;
      linkEnd = "podcast-episodes.json";
    } else if (_subject === FeedSubject.podcastChannels) {
      _type = FeedType.topSubscriber;
      linkEnd = "podcast-channels.json";
    } else {
      linkEnd = "podcasts.json";
    }

    const link = `${ITUNES_RSS_FEED_LINK}/${
      _country ? _country : "gb"
    }/podcasts/${
      _type === FeedType.topSubscriber ? "top-subscriber" : "top"
    }/${_limit}/${linkEnd}`;

    return encodeURI(link);
  }

  async function fetch() {
    const { title, country, updated, results } = (await axios.get(getLink()))
      .data.feed;
    const feedResults = [];
    if (results) {
      for (const result of results) {
        const id = parseInt(result.id);
        if (isNaN(id)) {
          continue;
        }
        const genres = [];
        if (result.genres) {
          for (const genre of result.genres) {
            genres.push(genre.name);
          }
        }
        feedResults.push({
          artistName: result.artistName,
          id: id,
          name: result.name,
          kind: result.kind,
          artworkUrl100: result.artworkUrl100,
          genres: genres,
        } as PodcastFeedResult);
      }
    }
    return {
      title,
      country,
      updated,
      results: feedResults,
    } as FeedReturn;
  }

  const obj = {
    country,
    type,
    subject,
    limit,
    getLink,
    fetch,
  };

  return obj;
}

export function podcastSearchLink() {
  let _country: string | undefined;
  let _entity: string | undefined;
  let _attribute: string | undefined;
  let _limit: number | undefined;
  let _lang: string | undefined;
  let _version: number | undefined;
  let _explicit = false;
  let _term: string | undefined;

  function country(country: string) {
    _country = country.toUpperCase();
    return obj;
  }
  function entity(entity: string) {
    _entity = entity;
    return obj;
  }
  function attribute(attribute: string) {
    _attribute = attribute;
    return obj;
  }
  function limit(limit: number) {
    _limit = limit;
    return obj;
  }
  function lang(lang: string) {
    _lang = lang;
    return obj;
  }
  function version(version: number) {
    _version = version;
    return obj;
  }
  function explicit(explicit: boolean) {
    _explicit = explicit;
    return obj;
  }
  function term(term: string) {
    _term = term;
    return obj;
  }
  function getLink() {
    let link = ITUNES_PODCAST_SEARCH_LINK;

    if (_country) {
      link += `&country=${_country}`;
    }
    if (_entity) {
      link += `&entity=${_entity}`;
    }
    if (_attribute) {
      link += `&attribute=${_attribute}`;
    }
    if (_limit) {
      link += `&limit=${_limit}`;
    }
    if (_lang) {
      link += `&lang=${_lang}`;
    }
    if (_version) {
      link += `&version=${_version}`;
    }
    if (!_explicit) {
      link += `&explicit=No`;
    }
    if (_term) {
      link += `&term=${_term}`;
    }

    return encodeURI(link);
  }

  async function fetch(): Promise<SearchReturn> {
    return (await axios.get(getLink())).data;
  }

  const obj = {
    _country,
    _entity,
    _attribute,
    _limit,
    _lang,
    _version,
    _explicit,
    _term,
    country,
    entity,
    attribute,
    limit,
    lang,
    version,
    explicit,
    term,
    getLink,
    fetch,
  };
  return obj;
}

// export async function podcastLookupLink() {
//   let
// }

export async function getFeed(lookupId: number): Promise<
  Prisma.PodcastGetPayload<{
    include: { episodes: true; feedItunesCategories: true };
  }>
> {
  return (
    await axios.post("/api/podcast/lookup", {
      id: lookupId,
    })
  ).data;
}

export function getLookupLink({
  prop,
  value,
}: {
  prop?: string;
  value: string;
}) {
  // TODO: Maybe use zod for validation here?
  const lookupProp = prop ?? "id";
  return `${ITUNES_PODCAST_LOOKUP_LINK}${lookupProp}=${value}`;
}

export async function lookupPodcast({
  lookupId,
  lookupType,
}: {
  lookupId: string;
  lookupType?: string;
}): Promise<SearchReturn> {
  return (
    await axios.get(
      `${ITUNES_PODCAST_LOOKUP_LINK}&${lookupType ?? "id"}=${lookupId}`
    )
  ).data;
}
