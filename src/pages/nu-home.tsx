import Link from "next/link";
import React, { ChangeEvent, FocusEvent, useState } from "react";
import { atom, useAtom } from "jotai";
import { useDebounce } from "../hooks/debounce";
import { NextPage } from "next";
import { Search } from "react-feather";

const searchAtom = atom("");

const NuHome: NextPage = () => {
  const inputBackground =
    "backdrop-blur-sm bg-black/20 dark:bg-white/10 outline-none border-transparent border-solid border-2";

  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);

  const [localTerms, setLocalTerms] = useState("");
  const [terms, setTerms] = useAtom(searchAtom);

  const setTermsDebounced = useDebounce((value: string) => {
    setTerms(value);
  });

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) {
      setIsNavExpanded(true);
    } else if (isNavExpanded) {
      setIsNavExpanded(false);
    }
    setLocalTerms(e.target.value);
    setTermsDebounced(e.target.value);
  }

  function handleSearchFieldFocus(e: FocusEvent<HTMLInputElement>) {
    setIsSearchInputFocused(e.type === "focus");
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
                      <a className="font-bold hover:text-gray-300 transition duration-150">
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
          <main className="flex flex-col justify-end pb-10 h-half-screen">
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
                value={localTerms}
                onChange={handleInputChange}
                className={`px-3 py-2 w-96 placeholder-black/70 dark:placeholder-white/50 text-lg rounded-r-lg ${inputBackground} border-l-0 transition focus:border-y-black/30 dark:focus:border-y-white/10 focus:border-r-black/30 dark:focus:border-r-white/10 duration-150`}
                onFocus={handleSearchFieldFocus}
                onBlur={handleSearchFieldFocus}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default NuHome;
