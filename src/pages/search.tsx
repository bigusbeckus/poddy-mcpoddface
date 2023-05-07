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
import { DefaultLayout } from "@/layouts/default";
import { type NextPageWithLayout } from "@/pages/_app";

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
const SearchPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  q,
}) => {
  const queryClient = useQueryClient();

  const [input, setInput] = useState(q);
  const [searchTerms, setSearchTerms] = useState(q);

  const queryResult = useQuery({
    queryKey: ["podcasts", "search", searchTerms],
    queryFn: () => podcastSearchLink().term(searchTerms).limit(64).fetch(),
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
    <>
      {/* <div className="flex justify-center p-2"> */}
      {/*   <form onSubmit={handleSubmit}> */}
      {/*     <TextField */}
      {/*       value={input} */}
      {/*       onChange={handleSearchTermsChange} */}
      {/*       placeholder="Search" */}
      {/*       className="w-96 text-xl" */}
      {/*     /> */}
      {/*   </form> */}
      {/* </div> */}
      <div className="flex flex-1 overflow-y-hidden">
        <div className="p-4">
          <div className="w-96 rounded-md bg-gray-900 p-8">
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
        <div className="flex h-full grow">
          <AnimatePresence mode="wait" initial={false}>
            <SearchPageComponentDiscriminator q={searchTerms} queryResult={queryResult} />
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

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
    <AnimatedLayout containerType="div" className="w-full h-full">
      <div>Loading search results...</div>
    </AnimatedLayout>
  );
}

// Error component
function SearchPageError({ error, q }: { error: unknown; q: string }) {
  return (
    <AnimatedLayout containerType="div">
      <div> {error instanceof Error ? error.message : `Search for podcast: "${q}" failed`}</div>
    </AnimatedLayout>
  );
}

// Search results display component
function SearchResults({ data, q }: { data: SearchReturn; q: string }) {
  return (
    <AnimatedLayout containerType="div" className="h-full w-full overflow-y-scroll p-8">
      <Head>
        <title>{data.resultCount} result(s) - Search - Poddy McPodface</title>
      </Head>
      <h1 className="text-2xl font-light">
        {data.resultCount.toString()} result(s) found for
        <span className="ml-2 font-bold">{q}</span>
      </h1>
      <hr className="my-8 border-white/10" />
      <div className="grid grid-cols-8 gap-2 pb-4">
        {data.results.map((podcast) => (
          <PodcastThumb
            key={podcast.collectionId}
            id={podcast.collectionId}
            artworkUrl={podcast.artworkUrl600}
            name={podcast.collectionName}
          />
        ))}
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

SearchPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default SearchPage;
