import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { useDebounce } from "../hooks/debounce";
import { NextPage } from "next";

const searchAtom = atom("");

const NuHome: NextPage = () => {
  const navHeightCollapsed = "h-12",
    navHeightExpanded = "h-full";

  const [isNavExpanded, setIsNavExpanded] = useState(true);

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

  return (
    <>
      <div className="h-full overflow-y-scroll bg-[url('../data/slanted-thumbs-gradient.png')] bg-cover bg-no-repeat bg-blend-color-burn">
        <div className="h-full dark:bg-black/80">
          {/* <NavBar className="bg-red-900/10 w-screen flex justify-between fixed top-0 z-10">
          nav
        </NavBar> */}
          <header className="py-2 px-8">
            {/* Nav bar */}
            <nav
              className={`${navHeightCollapsed} w-full align-middle flex flex-col justify-center`}
            >
              <div className="flex justify-between">
                <div className="flex flex-col justify-center">
                  <Link href="/">
                    <div className="bg-gray-900 text-primary_light-300 dark:bg-white/50 dark:text-gray-900 py-0 px-2 rounded-sm font-black align-middle cursor-pointer">
                      Poddy McPoddface
                    </div>
                  </Link>
                </div>
                <div className="flex justify-end">
                  <input
                    type="text"
                    value={localTerms}
                    placeholder={"Search"}
                    onChange={handleInputChange}
                    className="px-3 py-1 rounded-lg bg-black/10 dark:bg-white/10 outline-none border-transparent focus:border-black/10 dark:focus:border-white/10 border-solid border-2 transition duration-100"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex justify-end gap-4">
                    <Link href="/login">
                      <span className="font-bold">Login</span>
                    </Link>
                    <Link href="#">
                      <span className="font-bold">Sign up</span>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          {/* Landing content */}
          <main className="pt-72 h-half-screen">
            <div>
              <h1 className="text-4xl font-extrabold dark:text-white/80 text-center">
                Listen Everywhere
              </h1>
              <h2 className="mt-1 text-lg font-light dark:text-white/70 text-center">
                Podcast sync without the fuss
              </h2>
            </div>
            <div className="mt-8 flex justify-center">
              <input
                type="text"
                placeholder="Search"
                value={localTerms}
                onChange={handleInputChange}
                className="px-4 py-1 text-lg rounded-md bg-black/10 dark:bg-white/10 outline-none border-transparent focus:border-black/10 dark:focus:border-white/10 border-solid border-2 transition duration-100"
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default NuHome;
