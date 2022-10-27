import { Episode, iTunesCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
// import { GetServerSideProps } from "next";
import { getFeed, PodcastSearchResult } from "../libs/itunes-podcast";
import { FetchedImage } from "./image";
import { PodcastDescription } from "./podcast-description";

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
  const { data, isLoading, error } = useQuery(
    ["podcast", podcast.collectionId, "feed"],
    () => getFeed(podcast.collectionId)
  );

  function getDurationString(duration: number) {
    let durationString = "",
      hours = 0,
      minutes = 0,
      seconds = 0;
    if (duration > 3600) {
      hours = Math.floor(duration / 3600);
      duration -= hours * 3600;
      durationString += `${hours}`;
    }
    if (duration > 60) {
      minutes = Math.floor(duration / 60);
      duration -= minutes * 60;
      durationString += `${hours > 0 ? ":" : ""}${minutes
        .toString()
        .padStart(2, "0")}`;
    }
    seconds = duration;
    durationString += `${hours > 0 || minutes > 0 ? ":" : ""}${seconds
      .toString()
      .padStart(2, "0")}`;
    return durationString;
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
      <h1 className="text-5xl">{data.feedTitle}</h1>
      <div className="flex mb-10">
        {/* Thumbnail and details */}
        <div className="shrink w-96 py-8">
          <FetchedImage
            src={data.itunesArtworkUrl600}
            alt={`${data.feedTitle} thumbnail`}
            className=""
          />
          <div className="py-2 flex flex-wrap justify-center gap-2">
            {data.feedItunesCategories?.map((category: iTunesCategory) => (
              <span
                key={category.id}
                className="py-1 px-2 text-sm font-bold rounded-xl dark:bg-white/20 bg-black/20">
                {category.text}
              </span>
            ))}
          </div>
        </div>
        {/* Episodes */}
        <div className="grow w-96 pl-16 py-8 grid grid-cols-1 gap-3">
          {/* <h1 className="text-3xl">Episodes</h1> */}
          {data.episodes.map((episode: Episode) => (
            <div
              key={episode.id}
              className="p-2 rounded-md bg-black/20 dark:bg-white/20">
              <div className="flex h-32">
                <div className="w-32 shrink-0 grow-0">
                  <FetchedImage
                    src={episode.itunesImage ?? data.itunesArtworkUrl600}
                    alt={`${episode.title} thumbnail`}
                    className="w-full"
                    fill
                  />
                </div>
                <div className="flex-grow pl-4 grid grid-rows-4">
                  <div className="text-xl font-bold pb-2 row-span-1">
                    {episode.title}
                  </div>
                  <div className="text-sm row-span-2 dark:text-white/80">
                    <PodcastDescription
                      description={episode.description}
                      className="line-clamp-2"
                    />
                  </div>
                  <div className="row-span-1">
                    {episode.itunesDuration ? (
                      <div className=" align-bottom ">
                        {getDurationString(episode.itunesDuration)}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* {JSON.stringify(data)} */}
    </>
  );
};
