import { useQuery } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FocusEvent, FormEvent, useState } from "react";
import { Search } from "react-feather";
import { useDebounce } from "../../hooks/debounce";
import { useRecentSearches } from "../../hooks/recent-searches";
import { podcastSearchLink } from "../../libs/itunes-podcast";
import { ProgressCircular } from "../progress/progress-circular";
import { RecentSearchItemCard } from "./recent-item";
import { SearchResultItem } from "./results-item";

type SearchResultsCardProps = {
  className?: string;
  onSearchCardShow?: (eventType: string) => void;
  onSearchCardHide?: (eventType: string) => void;
};

const SEARCH_ITEMS_LIMIT = 8;

export const searchAtom = atom("");

export const SearchResultsCard: React.FC<SearchResultsCardProps> = ({
  className,
  onSearchCardShow,
  onSearchCardHide,
}) => {
  const router = useRouter();

  const [terms, setTerms] = useAtom(searchAtom);
  const { recentSearches, addToRecentSearches, clearRecentSearches } =
    useRecentSearches();

  const searchLink = podcastSearchLink().term(terms).limit(SEARCH_ITEMS_LIMIT);
  const { data, error, refetch, isInitialLoading } = useQuery({
    queryKey: ["podcasts"],
    queryFn: searchLink.fetch,
    enabled: false,
  });

  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const [isSearchCardShown, setIsSearchCardShown] = useState(false);

  const debouncedRefetch = useDebounce(refetch);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    if (terms.trim()) {
      addToRecentSearches(terms);
      router.push(`/search/?query=${encodeURI(terms)}`);
    }
  }

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

    // setIsSearchCardShown(hasFocus);

    if (hasFocus) {
      setIsSearchCardShown(true);
      if (onSearchCardShow && (terms.length > 0 || recentSearches.length > 0)) {
        onSearchCardShow(e.type);
      }
    } else if (onSearchCardHide) {
      setTimeout(() => {
        setIsSearchCardShown(false);
        onSearchCardHide(e.type);
      }, 250);
      // onSearchCardHide(e.type);
    }
  }

  function showSearchCard() {
    // return true;
    return isSearchCardShown && (terms.length > 0 || recentSearches.length > 0);
  }

  return (
    <div className={className}>
      <form onSubmit={handleSearchSubmit} className="flex justify-center">
        <input
          type="text"
          placeholder="Search"
          value={terms}
          onChange={handleInputChange}
          className={`px-3 py-2 w-96 placeholder-black/70 dark:placeholder-white/50 text-lg rounded-l-lg  backdrop-blur-sm bg-black/20 dark:bg-white/10 outline-none border-transparent border-solid border-2 border-r-1 transition focus:border-y-black/30 dark:focus:border-y-white/10 border-r-black/30 dark:border-r-white/5 focus:border-x-black/30 dark:focus:border-x-white/10 duration-150`}
          onFocus={handleSearchFieldFocus}
          onBlur={handleSearchFieldFocus}
        />
        <button
          className={`pl-2 pr-3 rounded-r-lg backdrop-blur-sm bg-black/20 hover:bg-black/30 dark:bg-white/10 dark:hover:bg-white/20 dark:active:bg-white/30 transition-colors border-transparent border-solid border-2 border-l-0 flex flex-col justify-center ${
            isSearchInputFocused
              ? "border-r-black/30 border-y-black/30 dark:border-r-white/10 dark:border-y-white/10"
              : ""
          }`}
          type="submit"
        >
          <Search
            size={20}
            className={`inline-block stroke-black dark:stroke-white transition duration-150 ${
              isSearchInputFocused ? "opacity-100" : "opacity-50"
            }`}
          />
        </button>
      </form>
      <div className="w-full flex justify-center items-top mt-1">
        <div
          className={`fixed overflow-hidden rounded-md origin-top backdrop-blur-md ${
            showSearchCard() ? "" : "opacity-0"
          } transition-opacity`}
        >
          <div className="px-2 py-2 bg-black/20 dark:bg-white/20 border-solid border-1 border-black/40 dark:border-white/40 rounded-md max-h-96 overflow-y-scroll">
            <div className="w-[26rem]">
              {showSearchCard() &&
                (isInitialLoading ? (
                  <ProgressCircular className="h-8 stroke-green-400" />
                ) : terms.length > 0 ? (
                  data && data.resultCount > 0 ? (
                    data.results.map((result) => (
                      <Link
                        key={result.collectionId}
                        href={{
                          pathname: `/podcast/${result.collectionId}`,
                        }}
                        passHref
                      >
                        <a>
                          <SearchResultItem result={result} />
                        </a>
                      </Link>
                    ))
                  ) : error ? (
                    <div className="px-2">
                      {error instanceof Error ? error.message : "Network error"}
                    </div>
                  ) : (
                    <div className="px-2">No results found</div>
                  )
                ) : recentSearches.length > 0 ? (
                  <div className="">
                    <div className="px-2 pt-1 py-2 text-sm text-black/50 dark:text-white/50">
                      Recent searches
                    </div>
                    {recentSearches.map((item) => (
                      <Link
                        key={item.id}
                        href={`/search/?query=${encodeURI(item.searchTerm)}`}
                        passHref
                      >
                        <a>
                          <RecentSearchItemCard item={item} />
                        </a>
                      </Link>
                      // <div key={item.searchTerm}>{item.searchTerm}</div>
                    ))}
                    <div className="flex justify-end pt-2 pb-1">
                      <button
                        className="text-xs text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-500 font-bold"
                        onClick={() => clearRecentSearches()}
                      >
                        Clear recents
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-2">Start typing to see results</div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
