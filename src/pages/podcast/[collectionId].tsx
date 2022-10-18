import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { HomeLayout } from "../../layouts/home";
import {
  getFeed,
  lookupPodcast,
  PodcastResult,
  SearchReturn,
} from "../../libs/itunes-podcast";
import { NextPageWithRootLayout } from "../_app";
import NextError from "next/error";
import Link from "next/link";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPageContext,
} from "next";
import { PodcastDetails } from "../../components/podcast-details";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const collectionId =
    params && params.collectionId && !(params.collectionId instanceof Array)
      ? params.collectionId.toString()
      : "";
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

const SelectedPodcastPage: NextPageWithRootLayout = ({
  collectionId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  // const { collectionId } = router.query;

  // if (!collectionId || collectionId instanceof Array) {
  //   // return <NextError statusCode={404} />;
  //   // return <div>NextError</div>;
  //   // router.push("404");
  //   return;
  // }

  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(
    ["podcast", collectionId],
    () => lookupPodcast({ lookupId: collectionId }),
    {
      initialData: () => {
        const result = (
          queryClient.getQueryData(["podcasts"]) as SearchReturn
        )?.results.find(
          (podcast) => podcast.collectionId.toString() === collectionId
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
  // const results = useQueries({
  //   queries: [
  //     {
  //       queryKey: ["podcast", collectionId],
  //       queryFn: () => lookupPodcast({ lookupId: collectionId }),
  //       initialData: () => {
  //         const result = (
  //           queryClient.getQueryData(["podcasts"]) as SearchReturn
  //         )?.results.find(
  //           (podcast) => podcast.collectionId.toString() === collectionId
  //         );
  //         console.log("Cached: ", result);
  //         if (result) {
  //           return {
  //             resultCount: 1,
  //             results: [result],
  //           } as SearchReturn;
  //         } else {
  //           return undefined;
  //         }
  //       },
  //     },
  //     {
  //       queryKey: ["podcast", collectionId, "feed"], queryFn: () =>
  //     }
  //   ],
  // });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error:{" "}
        {error instanceof Error
          ? error.message
          : `Lookup failed on collectionId: ${collectionId}`}
      </div>
    );
  }

  if (!(data && data.resultCount > 0 && data.results)) {
    return <div>Podcast not found</div>;
  }

  return (
    <div className="p-8">
      <div>ID: {collectionId}</div>
      <Link href={data.results[0].feedUrl}>{data.results[0].feedUrl}</Link>
      <PodcastDetails podcast={data.results[0]} />
    </div>
  );
};

SelectedPodcastPage.getLayout = (page: ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default SelectedPodcastPage;
