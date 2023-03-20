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
      <div className="flex">
        {/* <PodcastDetails podcast={data.results[0]} /> */}

        {/* Thumbnail and details */}
        <div className="flex-align-start sticky top-24 w-96 shrink p-8">
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
        <div className="flex-1 overflow-y-scroll px-8">
          <div className="grid w-full grow grid-cols-1 gap-3 py-8">
            {/* <h1 className="text-2xl font-bold">Episodes</h1> */}
            {feed.episodes.map((episode) => (
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
      </div>
    </AnimatedLayout>
  );
};

SelectedPodcastPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default SelectedPodcastPage;
