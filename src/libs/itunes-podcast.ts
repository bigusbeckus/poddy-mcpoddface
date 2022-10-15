import axios from "axios";

export const BASE_LINK = "https://itunes.apple.com/search?media=podcast";

export type PodcastResult = {
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
  results: PodcastResult[];
};

export function itunesPodcastLink() {
  let _country: string | undefined;
  let _entity: string | undefined;
  let _attribute: string | undefined;
  let _limit: number | undefined;
  let _lang: string | undefined;
  let _version: number | undefined;
  let _explicit: boolean = false;
  let _term: string | undefined;

  function country(country: string) {
    _country = country;
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
  function get() {
    let link = BASE_LINK;

    if (_country) {
      link += `&country=${_country.toUpperCase()}`;
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
    return (await axios.get(get())).data;
  }

  let obj = {
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
    get,
    fetch,
  };
  return obj;
}
