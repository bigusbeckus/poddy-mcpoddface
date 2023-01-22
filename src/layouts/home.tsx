import React, { ChangeEvent, ChangeEventHandler } from "react";
import { useContext } from "react";
import { ThemeContext } from "context/theme";
import { Toggle } from "components/toggle";
import { NavBar } from "components/nav";
import Link from "next/link";
import { atom, useAtom } from "jotai";
import { TextField } from "components/input/text-field";
import { podcastSearchLink } from "libs/itunes-podcast";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "hooks/debounce";

export const searchInputAtom = atom<string>("");

export const HomeLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useContext(ThemeContext);
  const [terms, setTerms] = useAtom(searchInputAtom);

  const searchLink = podcastSearchLink().term(terms);

  const { data, error, isFetching, refetch } = useQuery(
    ["podcasts"],
    searchLink.fetch
  );

  const debouncedRefetch = useDebounce(refetch);

  function handleTermsInput(e: ChangeEvent<HTMLInputElement>) {
    setTerms(e.target.value);
    console.log(e.target.value);
    debouncedRefetch();
  }

  return (
    <>
      <main className="h-full flex flex-col">
        <NavBar className="w-screen flex justify-between fixed top-0 z-10">
          <Link href="/">
            <div className="bg-gray-900 text-primary_light-300 dark:bg-white/50 dark:text-gray-900 py-0 px-2 rounded-sm font-black align-middle cursor-pointer">
              Poddy McPoddface
            </div>
          </Link>
          <div
            className={`transition duration-100 flex justify-center text-xl w-full z-10 ${
              terms ? "py-2" : ""
            }`}
          >
            <TextField
              value={terms}
              onChange={handleTermsInput}
              placeholder="Search"
              className={terms ? "scale-90" : ""}
            />
          </div>
          <Toggle
            enabled={darkMode}
            leading="Dark Mode"
            srLabel="Dark Mode"
            onChange={(checked) => setDarkMode(checked)}
          />
        </NavBar>
        <div className="h-full flex flex-col">
          <div className="h-16"></div>
          <div className="flex-1 overflow-y-scroll">{children}</div>
        </div>
      </main>
    </>
  );
};
