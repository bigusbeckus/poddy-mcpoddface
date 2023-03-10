import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { AnimatedLayout } from "layouts/animated";
import { podcastSearchLink, SearchReturn } from "libs/itunes-podcast";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<{
  q: string;
}> = async ({ query }) => {
  const q = query.q?.toString();

  if (!q) {
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };
  }

  return {
    props: {
      q,
    },
  };
};

// Search page root
function SearchPage({ q }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ["podcasts", "search", q],
    queryFn: () => podcastSearchLink().term(q).fetch(),
    placeholderData: () => {
      return queryClient.getQueryData<SearchReturn>(["podcasts"]);
    },
  });

  return (
    <AnimatedLayout>
      <div className="h-full">
        <AnimatePresence mode="wait" initial={false}>
          <SearchPageComponentDiscriminator q={q} queryResult={queryResult} />
        </AnimatePresence>
      </div>
    </AnimatedLayout>
  );
}

// Loading/error handler and component selector
function SearchPageComponentDiscriminator({
  q,
  queryResult,
}: {
  q: string;
  queryResult: {
    data: SearchReturn | undefined;
    error: unknown;
    isLoading: boolean;
  };
}) {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return <SearchPageLoading />;
  }

  if (error || !data) {
    return <SearchPageError error={error} q={q} />;
  }

  if (data.resultCount === 0) {
    return <NoSearchResults />;
  }

  return <SearchResults data={data} q={q} />;
}

// Loading state
function SearchPageLoading() {
  return (
    <AnimatedLayout>
      <div>Loading search results...</div>
    </AnimatedLayout>
  );
}

// Error component
function SearchPageError({ error, q }: { error: unknown; q: string }) {
  return (
    <AnimatedLayout>
      <div> {error instanceof Error ? error.message : `Search for podcast: "${q}" failed`}</div>
    </AnimatedLayout>
  );
}

// Search results display component
function SearchResults({ data, q }: { data: SearchReturn; q: string }) {
  return (
    <AnimatedLayout>
      <Head>
        <title>{data.resultCount} result(s) - Search - Poddy McPodface</title>
      </Head>
      <div className="h-full overflow-y-scroll p-8">
        <div>
          <h1 className="text-3xl font-light">
            {data.resultCount.toString()} result(s) found for &quot;{q}&quot;
          </h1>
          <hr className="my-8 border-white/10" />
          <ul>
            {data.results.map((podcast) => (
              <li key={podcast.collectionId}>
                <Link href={`podcast/${podcast.collectionId}`}>
                  <a className="hover:underline">{podcast.collectionName}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnimatedLayout>
  );
}

// No results component
function NoSearchResults() {
  return (
    <AnimatedLayout>
      <Head>
        <title>No results found - Search - Poddy McPodface</title>
      </Head>
      <div className="flex h-full items-center justify-center overflow-hidden">
        <div className="text-3xl font-light">No results found</div>
      </div>
    </AnimatedLayout>
  );
}

export default SearchPage;
