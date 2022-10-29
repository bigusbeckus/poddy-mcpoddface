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
    <div className={`h-full p-8 flex flex-col justify-center items-center`}>
      <div
        className={`transition duration-1000 overflow-hidden flex flex-col justify-end ${
          terms ? "h-0 opacity-0" : "pb-16 -mt-16"
        }`}>
        <h1 className={`text-6xl font-extrabold`}>Podcasts Everywhere</h1>
      </div>
      <div
        className={`transition duration-300 text-xl ${
          terms ? "scale-90" : ""
        }`}>
        <TextField
          value={terms}
          onChange={handleTermsInput}
          placeholder="Search"
        />
      </div>
      <div className={`w-full p-8 ${terms ? "flex-1" : ""}`}>
        {isFetching ? (
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
        )}
      </div>
    </div>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
