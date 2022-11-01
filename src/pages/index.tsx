import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, ReactElement, useState } from "react";
import { TextField } from "../components/input/text-field";
import { Loading } from "../components/loading";
import { PodcastList } from "../components/podcast-list";
import { useDebounce } from "../hooks/debounce";
import { HomeLayout } from "../layouts/home";
import { podcastSearchLink } from "../libs/itunes-podcast";
import { NextPageWithRootLayout } from "./_app";

const Home: NextPageWithRootLayout = () => {
  const [terms, setTerms] = useState("");

  const searchLink = podcastSearchLink().term(terms);

  const { data, error, isFetching, refetch } = useQuery(
    ["podcasts"],
    searchLink.fetch
  );
  const debouncedRefetch = useDebounce(refetch);

  function handleTermsInput(event: ChangeEvent<HTMLInputElement>) {
    setTerms(event.target.value);
    debouncedRefetch();
  }

  return (
    <div className={`h-full px-8`}>
      <div className={`fixed top-0 w-full ${terms ? "" : "h-100"}`}>
        <div
          className={`transition-all duration-500 overflow-hidden flex flex-col justify-end ${
            terms ? "h-0 opacity-0" : "h-half-screen pb-8"
          }`}>
          <h1 className={`text-6xl text-center font-extrabold`}>
            Podcasts Everywhere
          </h1>
        </div>
        <div
          className={`transition duration-100 flex justify-center text-xl w-full z-10 ${
            terms ? "py-2" : ""
          }`}>
          <TextField
            value={terms}
            onChange={handleTermsInput}
            placeholder="Search"
            className={terms ? "scale-90" : ""}
          />
        </div>
      </div>
      <div
        className={`transition-all duration-500 w-full py-8 overflow-hidden ${
          terms ? (isFetching ? "h-2/3" : "h-min") : "h-0 opacity-0"
        }`}>
        {terms ? (
          isFetching ? (
            <Loading />
          ) : error ? (
            <div>
              Error:{" "}
              {error instanceof Error
                ? (error as Error).message
                : "An error occured"}
            </div>
          ) : (
            <PodcastList podcasts={data ? data.results : []} />
          )
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
