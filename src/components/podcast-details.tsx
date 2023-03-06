import { Episode, iTunesCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
// import { GetServerSideProps } from "next";
import { getFeed, PodcastSearchResult } from "libs/itunes-podcast";
import { FetchedImage } from "components/image";
import { EpisodeItem } from "./episode-item";

type PodcastDetailsProps = {
  podcast: PodcastSearchResult;
};

// export const getServerSideProps: GetServerSideProps = async ({params}) {
//   if (!(params && params.podcast)) {
//     return {
//       error: true
//     }
//   }
//   const {collectionId, feedUrl} = params.podcast as PodcastResult;

// }

export const PodcastDetails: React.FC<PodcastDetailsProps> = ({ podcast }) => {
  const { data, isLoading, error } = useQuery(["podcast", podcast.collectionId, "feed"], () =>
    getFeed(podcast.collectionId)
  );

  function handleEpisodeOnClick(feedUrl: string) {
    console.log(feedUrl);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || error) {
    return (
      <div>
        Error:{" "}
        {error instanceof Error
          ? error.message
          : `Lookup failed on collectionId: ${podcast.collectionId}`}
      </div>
    );
  }

  return (
    <>
      <div className="flex p-8 pb-0">
        {/* Thumbnail and details */}
        <div className="flex-align-start sticky top-24 w-96 shrink">
          <FetchedImage
            src={data.itunesArtworkUrl600}
            alt={`${data.feedTitle} thumbnail`}
            imgClassName="rounded-md"
          />
          <h1 className="py-4 text-center text-3xl">{data.feedTitle}</h1>
          <div className="flex flex-wrap justify-center gap-2 py-2">
            {data.feedItunesCategories?.map((category: iTunesCategory) => (
              <span
                key={category.id}
                className="rounded-xl bg-black/20 py-1 px-2 text-sm font-bold dark:bg-white/20"
              >
                {category.text}
              </span>
            ))}
          </div>
        </div>
        {/* Episodes */}
        <div className="grid w-96 grow grid-cols-1 gap-3 pl-16">
          {/* <h1 className="text-3xl">Episodes</h1> */}
          {data.episodes.map((episode: Episode) => (
            <EpisodeItem
              key={episode.id}
              title={episode.title}
              description={episode.description ?? undefined}
              url={episode.url}
              artworkUrl={episode.itunesImage ?? data.itunesArtworkUrl600}
              duration={episode.itunesDuration ?? undefined}
              podcast={{
                title: data.feedTitle,
                url: `/podcast/${data.itunesCollectionId}`,
                collectionId,
              }}
              onClick={() => handleEpisodeOnClick(episode.url)}
            />
          ))}
        </div>
      </div>
      {/* {JSON.stringify(data)} */}
    </>
  );
};
