import { useQuery, useQueryClient } from "@tanstack/react-query";
import { podcastSearchLink, SearchReturn } from "../../libs/itunes-podcast";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
// import { PodcastDetails } from "../../components/podcast-details";
import { AnimatedLayout } from "layouts/animated";
import { getFeed } from "libs/itunes-podcast";
import { FetchedImage } from "components/image";
import { Episode, iTunesCategory } from "@prisma/client";
import { EpisodeItem } from "components/episode-item";

export const getServerSideProps: GetServerSideProps<{
  collectionId: number;
}> = async ({ params }) => {
  const collectionIdStr =
    params && params.collectionId && !(params.collectionId instanceof Array)
      ? params.collectionId.toString()
      : "";
  const collectionId = parseInt(collectionIdStr);

  if (!collectionId) {
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };
  }

  return {
    props: {
      collectionId,
    },
  };
};

const SelectedPodcastPage = ({
  collectionId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const queryClient = useQueryClient();

  function handleEpisodeOnClick(feedUrl: string) {
    console.log(feedUrl);
  }

  const {
    data: podcast,
    error: podcastError,
    isLoading: podcastIsLoading,
  } = useQuery(
    ["podcast", collectionId],
    () => podcastSearchLink().term(collectionId.toString()).fetch(),
    {
      initialData: () => {
        const result = (queryClient.getQueryData(["podcasts"]) as SearchReturn)?.results.find(
          (podcast) => podcast.collectionId.toString() === collectionId.toString()
        );
        console.log("Cached: ", result);
        if (result) {
          return {
            resultCount: 1,
            results: [result],
          } as SearchReturn;
        } else {
          return undefined;
        }
        // //! FOR CACHE TESTING ONLY
        // return {
        //   resultCount: 1,
        //   results: [result],
        // };
      },
    }
  );

  const {
    data: feed,
    error: feedError,
    isLoading: feedIsLoading,
  } = useQuery({
    queryKey: ["podcast", collectionId, "feed"],
    queryFn: () => getFeed(collectionId),
    enabled: !!podcast,
  });
  if (podcastIsLoading || feedIsLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (podcastError || feedError) {
    const error = podcastError ?? feedError;
    return (
      <div className="p-8">
        Error:{" "}
        {error instanceof Error ? error.message : `Lookup failed on collectionId: ${collectionId}`}
      </div>
    );
  }

  if (!(podcast && podcast.resultCount > 0 && podcast.results)) {
    return <div>Podcast not found</div>;
  }

  if (!feed) {
    return <div>No episodes found</div>;
  }

  return (
    <AnimatedLayout>
      <div className="flex h-full overflow-y-scroll p-8">
        {/* <PodcastDetails podcast={data.results[0]} /> */}

        {/* Thumbnail and details */}
        <div className="flex-align-start sticky top-24 w-96 shrink">
          <FetchedImage
            src={feed.itunesArtworkUrl600}
            alt={`${feed.feedTitle} thumbnail`}
            imgClassName="rounded-md"
          />
          <h1 className="py-4 text-center text-3xl">{feed.feedTitle}</h1>
          <div className="flex flex-wrap justify-center gap-2 py-2">
            {feed.feedItunesCategories?.map((category: iTunesCategory) => (
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
          {/* <h1 className="text-2xl font-bold">Episodes</h1> */}
          {feed.episodes.map((episode: Episode) => (
            <EpisodeItem
              key={episode.id}
              title={episode.title}
              description={episode.description ?? undefined}
              url={episode.url}
              artworkUrl={episode.itunesImage ?? feed.itunesArtworkUrl100}
              duration={episode.itunesDuration ?? undefined}
              podcast={{
                title: feed.feedTitle,
                url: `/podcast/${collectionId}`,
                collectionId,
              }}
              onClick={() => handleEpisodeOnClick(episode.url)}
            />
          ))}
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default SelectedPodcastPage;
