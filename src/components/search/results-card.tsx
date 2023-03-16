import { useQuery } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ChangeEvent, type FocusEvent, type FormEvent, useState } from "react";
import { Search } from "react-feather";
import { useDebounce } from "@/hooks/debounce";
import { useRecentSearches } from "@/hooks/recent-searches";
import { podcastSearchLink } from "@/libs/itunes-podcast";
import { ProgressCircular } from "@/components/progress/progress-circular";
import { RecentSearchItemCard } from "@/components/search/recent-item";
import { SearchResultItem } from "@/components/search/results-item";

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
  const { recentSearches, addToRecentSearches, clearRecentSearches } = useRecentSearches();

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
      router.push(`/search/?q=${encodeURI(terms)}`);
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
          className={`border-r-1 w-96 rounded-l-lg border-2 border-solid border-transparent border-r-black/30  bg-black/20 px-3 py-2 text-lg placeholder-black/70 outline-none backdrop-blur-sm transition duration-150 focus:border-y-black/30 focus:border-x-black/30 dark:border-r-white/5 dark:bg-white/10 dark:placeholder-white/50 dark:focus:border-y-white/10 dark:focus:border-x-white/10`}
          onFocus={handleSearchFieldFocus}
          onBlur={handleSearchFieldFocus}
        />
        <button
          className={`flex flex-col justify-center rounded-r-lg border-2 border-l-0 border-solid border-transparent bg-black/20 pl-2 pr-3 backdrop-blur-sm transition-colors hover:bg-black/30 dark:bg-white/10 dark:hover:bg-white/20 dark:active:bg-white/30 ${
            isSearchInputFocused
              ? "border-y-black/30 border-r-black/30 dark:border-y-white/10 dark:border-r-white/10"
              : ""
          }`}
          type="submit"
        >
          <Search
            size={20}
            className={`inline-block stroke-black transition duration-150 dark:stroke-white ${
              isSearchInputFocused ? "opacity-100" : "opacity-50"
            }`}
          />
        </button>
      </form>
      <div className="items-top mt-1 flex w-full justify-center">
        <div
          className={`fixed origin-top overflow-hidden rounded-md backdrop-blur-md ${
            showSearchCard() ? "" : "opacity-0"
          } transition-opacity`}
        >
          <div className="border-1 max-h-96 overflow-y-scroll rounded-md border-solid border-black/40 bg-black/20 px-2 py-2 dark:border-white/40 dark:bg-white/20">
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
                    <div className="px-2 py-2 pt-1 text-sm text-black/50 dark:text-white/50">
                      Recent searches
                    </div>
                    {recentSearches.map((item) => (
                      <Link
                        key={item.id}
                        href={`/search/?q=${encodeURI(item.searchTerm)}`}
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
                        className="text-xs font-bold text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-500"
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
