import { useQuery } from "@tanstack/react-query";
import { AnimatedLayout } from "layouts/animated";
import { podcastSearchLink } from "libs/itunes-podcast";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps<{
  q: string;
}> = async ({ query }) => {
  const q = query.q?.toString();
  console.log(q);
  console.log(query.query);

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

const Search = ({ q }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const searchLink = podcastSearchLink().term(q);
  const { data, error, isLoading } = useQuery(["podcasts"], searchLink.fetch);

  const [searchTerms, setSearchTerms] = useState(q);

  if (isLoading) {
    return (
      <AnimatedLayout>
        <div>Loading search results...</div>
      </AnimatedLayout>
    );
  }

  if (error || !data) {
    return (
      <AnimatedLayout>
        <div> {error instanceof Error ? error.message : `Search for podcast: "${q}" failed`}</div>
      </AnimatedLayout>
    );
  }

  if (data.resultCount === 0) {
    return (
      <AnimatedLayout>
        <div className="flex h-full items-center justify-center overflow-hidden">
          <div className="text-3xl font-light">No results found</div>
        </div>
      </AnimatedLayout>
    );
  }

  return (
    <AnimatedLayout>
      <Head>
        <title>{data.resultCount} result(s) - Search - Poddy McPodface</title>
      </Head>
      <div className="h-full overflow-y-scroll p-8">
        <div>
          <h1 className="text-3xl font-light">{data.resultCount.toString()} result(s) found</h1>
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
};

export default Search;
