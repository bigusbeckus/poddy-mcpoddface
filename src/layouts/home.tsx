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

export const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useContext(ThemeContext);
  const [terms, setTerms] = useAtom(searchInputAtom);

  const searchLink = podcastSearchLink().term(terms);

  const { data, error, isFetching, refetch } = useQuery(["podcasts"], searchLink.fetch);

  const debouncedRefetch = useDebounce(refetch);

  function handleTermsInput(e: ChangeEvent<HTMLInputElement>) {
    setTerms(e.target.value);
    console.log(e.target.value);
    debouncedRefetch();
  }

  return (
    <>
      <main className="flex h-full flex-col">
        <NavBar className="fixed top-0 z-10 flex w-screen justify-between">
          <Link href="/">
            <div className="cursor-pointer rounded-sm bg-gray-900 py-0 px-2 align-middle font-black text-primary_light-300 dark:bg-white/50 dark:text-gray-900">
              Poddy McPodface
            </div>
          </Link>
          <div
            className={`z-10 flex w-full justify-center text-xl transition duration-100 ${
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
        <div className="flex h-full flex-col">
          <div className="h-16"></div>
          <div className="flex-1 overflow-y-scroll">{children}</div>
        </div>
      </main>
    </>
  );
};
