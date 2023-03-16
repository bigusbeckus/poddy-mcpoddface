import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TextField } from "@/components/input/text-field";
import { PodcastThumb } from "@/components/podcast-thumb";
import { AnimatePresence } from "framer-motion";
// import { useDebounce } from "@/hooks/debounce";
import { AnimatedLayout } from "@/layouts/animated";
import { podcastSearchLink, type SearchReturn } from "@/libs/itunes-podcast";
import { type GetServerSideProps, type InferGetServerSidePropsType } from "next";
import Head from "next/head";
// import Link from "next/link";
import { type FormEvent, useState, type ChangeEvent } from "react";

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

  const [input, setInput] = useState(q);
  const [searchTerms, setSearchTerms] = useState(q);

  const queryResult = useQuery({
    queryKey: ["podcasts", "search", searchTerms],
    queryFn: () => podcastSearchLink().term(searchTerms).fetch(),
    placeholderData: () => {
      return queryClient.getQueryData<SearchReturn>(["podcasts"]);
    },
  });

  // const debouncedRefetch = useDebounce(queryResult.refetch);

  function handleSearchTermsChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input) {
      const url = encodeURI(window.location.href.split("?")[0] + "?q=" + input);
      window.history.pushState({ path: url }, "", url);
      setSearchTerms(input);
    }
  }

  return (
    <AnimatedLayout containerType="div" className="block h-full">
      <div className="flex h-full flex-col">
        <div className="flex justify-center p-2">
          <form onSubmit={handleSubmit}>
            <TextField
              value={input}
              onChange={handleSearchTermsChange}
              placeholder="Search"
              className="w-96 text-xl"
            />
          </form>
        </div>
        <div className="flex flex-1">
          <div className="w-96 p-4">
            <div className="rounded-md bg-gray-900 p-8">
              <h3 className="text-2xl font-extrabold text-emerald-500">Filter</h3>
              {/* <hr className="my-4 border-b-0 border-gray-800" /> */}
              <div className="py-2"></div>
              <div>
                <ul>
                  <li>Option 1</li>
                  <li>Option 2</li>
                  <li>Option 3</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex h-full flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <SearchPageComponentDiscriminator q={searchTerms} queryResult={queryResult} />
            </AnimatePresence>
          </div>
        </div>
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
          {/* <ul> */}
          {/*   {data.results.map((podcast) => ( */}
          {/*     <li key={podcast.collectionId}> */}
          {/*       <Link href={`podcast/${podcast.collectionId}`}> */}
          {/*         <a className="hover:underline">{podcast.collectionName}</a> */}
          {/*       </Link> */}
          {/*     </li> */}
          {/*   ))} */}
          {/* </ul> */}
          <div className="grid grid-cols-10 gap-1 pb-4">
            {data.results.map((podcast) => (
              <PodcastThumb
                key={podcast.collectionId}
                id={podcast.collectionId}
                artworkUrl={podcast.artworkUrl600}
                name={podcast.collectionName}
              />
            ))}
          </div>
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
