import Link from "next/link";
import React, { ChangeEvent, FocusEvent, useState } from "react";
import { atom, useAtom } from "jotai";
import { useDebounce } from "../hooks/debounce";
import { NextPage } from "next";
import { Search } from "react-feather";
import { MusicPlayer } from "../components/chat-gpt-player";
import { useQuery } from "@tanstack/react-query";
import { podcastSearchLink } from "../libs/itunes-podcast";
import { useRecentSearches } from "../hooks/recent-searches";

const searchAtom = atom("");

const NuHome: NextPage = () => {
  const inputBackground =
    "backdrop-blur-sm bg-black/20 dark:bg-white/10 outline-none border-transparent border-solid border-2";

  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const [isSearchCardFocused, setIsSearchCardFocused] = useState(false);

  // const [localTerms, setLocalTerms] = useState("");
  const [terms, setTerms] = useAtom(searchAtom);

  const searchLink = podcastSearchLink().term(terms).limit(3);
  const { data, error, isFetching, refetch, isLoading, isInitialLoading } =
    useQuery({
      queryKey: ["podcasts"],
      queryFn: searchLink.fetch,
      enabled: false,
    });

  // const setTermsDebounced = useDebounce((value: string) => {
  //   setTerms(value);
  // });

  const debouncedRefetch = useDebounce(refetch);

  const { recentSearches } = useRecentSearches();

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) {
      setIsNavExpanded(true);
    } else if (isNavExpanded) {
      setIsNavExpanded(false);
    }
    // setLocalTerms(e.target.value);
    // setTermsDebounced(e.target.value);
    setTerms(e.target.value);
    // if (e.target.value.length > 0 && !isSearchCardFocused) {
    //   setIsSearchCardFocused(true);
    // }
    if (e.target.value.length > 0) {
      debouncedRefetch();
    }
  }

  function handleSearchFieldFocus(e: FocusEvent<HTMLInputElement>) {
    const isFocused = e.type === "focus";
    setIsSearchInputFocused(isFocused);
    setIsSearchCardFocused(isFocused);
  }

  function handleSearchCardFocus(e: FocusEvent<HTMLDivElement>) {
    const hasFocus = e.type === "focus";
    // On focus
    if (hasFocus) {
      if (!isSearchCardFocused) {
        setIsSearchCardFocused(true);
      }
    }
    // On blur
    else {
      if (isSearchCardFocused && !isSearchInputFocused) {
        setIsSearchCardFocused(false);
      }
    }
  }

  function showSearchCard() {
    return (
      isSearchInputFocused && (terms.length > 0 || recentSearches.length > 0)
    );
  }

  return (
    <>
      <div className="h-full overflow-y-scroll bg-[url('../data/slanted-thumbs-gradient.png')] bg-cover bg-no-repeat bg-blend-color-burn">
        <div className="h-full dark:bg-black/80">
          <header className="py-6 px-8">
            {/* Nav bar */}
            <nav
              className={`h-12 w-full align-middle flex flex-col justify-center`}
            >
              <div className="flex justify-between">
                <div className="flex flex-col justify-center">
                  <Link href="/">
                    <div className="bg-gray-900 text-primary_light-300 dark:bg-white/50 dark:text-gray-900 py-0 px-2 rounded-sm font-black align-middle cursor-pointer">
                      Poddy McPoddface
                    </div>
                  </Link>
                </div>
                {/*
                <div className="flex justify-end">
                  <input
                    type="text"
                    value={localTerms}
                    placeholder={"Search"}
                    onChange={handleInputChange}
                    className="px-3 py-1 rounded-lg bg-black/10 dark:bg-white/10 outline-none border-transparent focus:border-black/10 dark:focus:border-white/10 border-solid border-2 transition duration-150"
                  />
                </div>
                */}
                <div className="flex flex-col justify-center">
                  <div className="flex justify-end items-center gap-8">
                    <Link href="/login">
                      <a className="font-bold hover:text-gray-300 transition">
                        Sign in
                      </a>
                    </Link>
                    <Link href="/signup">
                      <a className="font-bold bg-green-900 hover:bg-green-800 px-4 py-2 rounded-lg transition duration-150">
                        Create a new account
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          {/* Landing content */}
          <main
            className={`flex flex-col justify-end h-half-screen transition-[padding] duration-300 ${
              showSearchCard() ? "pb-10 " : ""
            }`}
          >
            <div>
              <h1 className="text-4xl font-extrabold dark:text-white/80 text-center">
                Listen Everywhere
              </h1>
              <h2 className="mt-1 text-lg dark:font-light dark:text-white/50 text-center">
                Podcast sync without the fuss
              </h2>
            </div>
            <div className="mt-10 flex justify-center">
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
                onFocus={handleSearchCardFocus}
                onBlur={handleSearchCardFocus}
              >
                <div className="px-6 py-2 bg-white/20 rounded-md max-h-80">
                  <div className="w-96">Search Results</div>
                </div>
              </div>
            </div>
            {/*
            <footer className="-z-1 fixed bottom-0 left-0 w-screen">
              <MusicPlayer />
            </footer>
            */}
          </main>
        </div>
      </div>
    </>
  );
};

export default NuHome;
