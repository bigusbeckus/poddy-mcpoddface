import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  podcastSearchLink,
  PodcastResult,
  SearchReturn,
} from "../libs/itunes-podcast";
import { NextPageWithRootLayout } from "./_app";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { HomeLayout } from "../layouts/home";
import { ChangeEvent, ReactElement, Suspense, useState } from "react";
import { debounce, result } from "lodash-es";
import { Modal } from "../components/modal";
import { Button } from "../components/button";
import { Dialog } from "@headlessui/react";
import { TextField } from "../components/input/text-field";
import { PodcastGridView, PodcastListView } from "../components/podcast-view";
import Link from "next/link";
import { PodcastList } from "../components/podcast-list";

// export async function getServerSideProps() {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery(
//     ["searchResults"],
//     itunesPodcastLink().term("some").fetch
//   );

//   return { props: { dehydratedState: dehydrate(queryClient) } };
// }

const Home: NextPageWithRootLayout = (props) => {
  const [terms, setTerms] = useState("");
  // const [dialogOpen, setDialogOpen] = useState(false);

  // const [selection, setSelection] = useState(null as PodcastResult | null);

  const searchLink = podcastSearchLink().term(terms).country("de");

  const { data, error, isLoading, refetch } = useQuery(
    ["podcasts"],
    searchLink.fetch
  );

  const [view, setView] = useState("grid");

  function toggleView() {
    if (view === "grid") {
      setView("list");
    } else {
      setView("grid");
    }
  }

  function handleTermsInput(event: ChangeEvent<HTMLInputElement>) {
    setTerms(event.target.value);
    debounce(refetch, 500, {
      leading: false,
      trailing: true,
    })();
  }

  // function handleItemClick(item: PodcastResult) {
  //   setSelection(item);
  //   setDialogOpen(true);
  // }

  if (isLoading) return <h1>Loading...</h1>;

  if (error instanceof Error) return <h1>{error.message}</h1>;

  return (
    <div className="p-8">
      {/* <input
        type="text"
        value={terms}
        placeholder="Search"
        onChange={handleTermsInput}
        className="bg-black/10 dark:bg-white/10 px-4 py-4 text-xl font-thin rounded-md"
      /> */}
      {/* <Link href="/">To second page</Link> */}
      <div className="py-2">Search Link: {searchLink.getLink()}</div>
      <div className="flex justify-between">
        <TextField
          value={terms}
          onChange={handleTermsInput}
          placeholder="Search"
        />
        <Button onClick={toggleView}>
          {view === "grid" ? "List View" : "Grid View"}
        </Button>
      </div>
      <hr className="my-4 border-white/10" />

      {data && (data as SearchReturn).resultCount > 0 ? (
        <PodcastList podcasts={data.results} view={view} />
      ) : terms ? (
        "No results found"
      ) : (
        "Start typing to get results"
      )}
    </div>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
