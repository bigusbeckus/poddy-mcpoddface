import { useQuery } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { useState, ChangeEvent, FocusEvent } from "react";
import { Search } from "react-feather";
import { useDebounce } from "../../hooks/debounce";
import { useRecentSearches } from "../../hooks/recent-searches";
import { podcastSearchLink } from "../../libs/itunes-podcast";
import { Loading } from "../loading";
import { ProgressCircular } from "../progress";

type SearchResultsCardProps = {
  className?: string;
  onSearchCardShow?: (eventType: string) => void;
  onSearchCardHide?: (eventType: string) => void;
};

export const searchAtom = atom("");

export const SearchResultsCard: React.FC<SearchResultsCardProps> = ({
  className,
  onSearchCardShow,
  onSearchCardHide,
}) => {
  const inputBackground =
    "backdrop-blur-sm bg-black/20 dark:bg-white/10 outline-none border-transparent border-solid border-2";

  const [terms, setTerms] = useAtom(searchAtom);
  const { recentSearches, addToRecentSearches } = useRecentSearches();

  const searchLink = podcastSearchLink().term(terms).limit(3);
  const { data, error, isFetching, refetch, isLoading, isInitialLoading } =
    useQuery({
      queryKey: ["podcasts"],
      queryFn: searchLink.fetch,
      enabled: false,
    });

  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const [isSearchCardShown, setIsSearchCardShown] = useState(false);

  const debouncedRefetch = useDebounce(refetch);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setTerms(e.target.value);
    if (e.target.value.length > 0) {
      debouncedRefetch();
    }

    if (
      onSearchCardShow &&
      isSearchCardShown &&
      (e.target.value.length > 0 || recentSearches.length > 0)
    ) {
      onSearchCardShow("focus");
    } else if (onSearchCardHide) {
      onSearchCardHide("blur");
    }
  }

  function handleSearchFieldFocus(e: FocusEvent<HTMLInputElement>) {
    const hasFocus = e.type === "focus";
    setIsSearchInputFocused(hasFocus);

    setIsSearchCardShown(hasFocus);

    if (hasFocus) {
      if (onSearchCardShow && (terms.length > 0 || recentSearches.length > 0)) {
        onSearchCardShow(e.type);
      }
    } else if (onSearchCardHide) {
      onSearchCardHide(e.type);
    }
  }

  function showSearchCard() {
    return isSearchCardShown && (terms.length > 0 || recentSearches.length > 0);
  }

  return (
    <div className={className}>
      <div className="flex justify-center">
        <div
          className={`pl-2 pr-1 rounded-l-lg ${inputBackground} border-r-0 flex flex-col justify-center ${
            isSearchInputFocused
              ? "border-l-black/30 border-y-black/30 dark:border-l-white/10 dark:border-y-white/10"
              : ""
          }`}
        >
          <Search
            size={20}
            className={`inline-block transition duration-150 ${
              isSearchInputFocused ? "opacity-100" : "opacity-50"
            }`}
          />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={terms}
          onChange={handleInputChange}
          className={`px-3 py-2 w-96 placeholder-black/70 dark:placeholder-white/50 text-lg rounded-r-lg ${inputBackground} border-l-0 transition focus:border-y-black/30 dark:focus:border-y-white/10 focus:border-r-black/30 dark:focus:border-r-white/10 duration-150`}
          onFocus={handleSearchFieldFocus}
          onBlur={handleSearchFieldFocus}
        />
      </div>
      <div className="w-full flex justify-center items-top mt-1">
        <div
          className={`fixed overflow-hidden rounded-md origin-top backdrop-blur-md ${
            showSearchCard() ? "" : "opacity-0"
          } transition-opacity`}
        >
          <div className="px-6 py-3 bg-white/20 rounded-md max-h-80">
            <div className="w-96">
              {isInitialLoading ? (
                <ProgressCircular className="h-8 stroke-green-400" />
              ) : terms.length > 0 ? (
                data && data.resultCount > 0 ? (
                  data.results.map((result) => (
                    <div key={result.trackId}> {result.trackName} </div>
                  ))
                ) : error ? (
                  <div>
                    {" "}
                    {error instanceof Error ? error.message : "Network error"}
                  </div>
                ) : (
                  "No results found"
                )
              ) : recentSearches.length > 0 ? (
                recentSearches.map((item) => (
                  <div key={item.searchTerm}> {item.searchTerm} </div>
                ))
              ) : (
                "Start typing to see results"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
