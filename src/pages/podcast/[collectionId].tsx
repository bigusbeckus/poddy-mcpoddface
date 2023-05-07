import { useQuery, useQueryClient } from "@tanstack/react-query";
import { podcastSearchLink, type SearchReturn } from "@/libs/itunes-podcast";
import { type GetServerSideProps, type InferGetServerSidePropsType } from "next";
import { AnimatedLayout } from "@/layouts/animated";
import { getFeed } from "@/libs/itunes-podcast";
import { FetchedImage } from "@/components/image";
import { type iTunesCategory } from "@prisma/client";
import { EpisodeItem } from "@/components/episode-item";
import Head from "next/head";
import { DefaultLayout } from "@/layouts/default";
import { type NextPageWithLayout } from "@/pages/_app";

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

const SelectedPodcastPage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ collectionId }) => {
  const queryClient = useQueryClient();

  function handleEpisodeOnClick(feedUrl: string) {
    console.log(feedUrl);
  }

  const {
    data: podcast,
    error: podcastError,
    isLoading: podcastIsLoading,
  } = useQuery({
    queryKey: ["podcast", collectionId],
    queryFn: () => podcastSearchLink().term(collectionId.toString()).fetch(),
    placeholderData: () => {
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
  });

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
    return (
      <AnimatedLayout>
        <div className="h-full p-8">Loading...</div>
      </AnimatedLayout>
    );
  }

  if (podcastError || feedError) {
    const error = podcastError ?? feedError;
    return (
      <AnimatedLayout>
        <div className="p-8">
          Error:{" "}
          {error instanceof Error
            ? error.message
            : `Lookup failed on collectionId: ${collectionId}`}
        </div>
      </AnimatedLayout>
    );
  }

  if (!(podcast && podcast.resultCount > 0 && podcast.results)) {
    return (
      <AnimatedLayout>
        <div>Podcast not found</div>
      </AnimatedLayout>
    );
  }

  if (!feed) {
    return (
      <AnimatedLayout>
        <div>No episodes found</div>
      </AnimatedLayout>
    );
  }

  return (
    <AnimatedLayout className="h-full overflow-y-scroll">
      <Head>
        <title>{feed.feedTitle} - Poddy McPodface</title>
      </Head>
      <div className="flex justify-center">
        <div className="flex w-3/4">
          {/* <PodcastDetails podcast={data.results[0]} /> */}

          {/* Thumbnail and details */}
          <div className="flex-align-start sticky top-2 w-96 shrink p-8">
            <FetchedImage
              src={feed.itunesArtworkUrl600}
              alt={`${feed.feedTitle} thumbnail`}
              // imgClassName="rounded-md"
              // wrapperClassName="shadow shadow-black/30 shadow-lg"
            />
            <h1 className="py-6 text-center text-2xl">{feed.feedTitle}</h1>
            <p className="break-words border-y border-y-gray-300 px-2 py-4 text-sm text-gray-500 dark:border-y-gray-800">
              {feed.feedDescription}
            </p>
            <div className="flex flex-wrap items-center gap-2 py-6 px-1 text-xs">
              {/* <span className="pr-2">Tags:</span> */}
              {feed.feedItunesCategories?.map((category: iTunesCategory) => (
                <span
                  key={category.id}
                  className="rounded-xl py-1 px-2 text-gray-700 outline outline-1 outline-gray-500 dark:text-gray-400 dark:outline-gray-700"
                >
                  {category.text}
                </span>
              ))}
            </div>
          </div>
          {/* Episodes */}
          <div className="flex-1 px-8">
            <div className="grid w-full grow grid-cols-1 divide-y divide-gray-800 py-8">
              {/* <h1 className="text-2xl font-bold">Episodes</h1> */}
              {feed.episodes.map((episode) => (
                <EpisodeItem
                  key={episode.id}
                  title={episode.title}
                  description={episode.description ?? undefined}
                  url={episode.url}
                  artworkUrl={episode.itunesImage ?? feed.itunesArtworkUrl100}
                  duration={episode.itunesDuration ?? undefined}
                  releaseDate={episode.pubDate}
                  podcast={{
                    title: feed.feedTitle,
                    url: `/podcast/${collectionId}`,
                    artworkUrl: podcast.results[0].artworkUrl600,
                    collectionId,
                  }}
                  onClick={() => handleEpisodeOnClick(episode.url)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
};

SelectedPodcastPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default SelectedPodcastPage;
