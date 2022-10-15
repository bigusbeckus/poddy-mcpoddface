import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  itunesPodcastLink,
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
import Link from "next/link";

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
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selection, setSelection] = useState(null as PodcastResult | null);

  const { data, error, isLoading, refetch } = useQuery(
    ["searchResults"],
    itunesPodcastLink().term(terms).fetch
  );

  function handleTermsInput(event: ChangeEvent<HTMLInputElement>) {
    setTerms(event.target.value);
    debounce(refetch, 500, {
      leading: false,
      trailing: true,
    })();
  }

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
      <TextField
        value={terms}
        onChange={handleTermsInput}
        placeholder="Search"
      />
      {/* <Link href="/">To second page</Link> */}
      <div className="py-2">
        Search Link: {itunesPodcastLink().term(terms).get()}
      </div>
      <hr className="mb-4 border-white/10" />

      <Modal state={[dialogOpen, setDialogOpen]}>
        <Dialog.Panel className="w-full max-w-md p-8 rounded-md bg-white dark:bg-gray-700">
          {selection ? (
            <Dialog.Title as="h3" className="">
              {selection.collectionName}
            </Dialog.Title>
          ) : (
            <div>something</div>
          )}
        </Dialog.Panel>
      </Modal>

      <div className="grid grid-cols-8 gap-1">
        {/* {JSON.stringify(data.resultCount)} */}
        {(data as SearchReturn).resultCount > 0
          ? (data as SearchReturn).results.map((result) => (
              <div
                key={result.trackId}
                onClick={() => {
                  setSelection(result);
                  setDialogOpen(true);
                }}
                className="hover:bg-background_light/20 hover:dark:bg-background_dark/20 p-1  cursor-pointer rounded-md transition duration-300">
                <img src={result.artworkUrl600} className="w-full rounded-md" />
                <div className="mt-2 leading-tight text-center text-ellipsis">
                  {result.collectionName}
                </div>
              </div>
            ))
          : terms
          ? "No results found"
          : "Start typing to get results"}
      </div>
    </div>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
