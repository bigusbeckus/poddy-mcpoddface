import Link from "next/link";
import { NextPage } from "next";
import { MusicPlayer } from "../components/chat-gpt-player";
import { useState } from "react";
import { SearchResultsCard } from "../components/search/results-card";

const NuHome: NextPage = () => {
  const [searchCardShown, setSearchCardShown] = useState(false);

  const handleSearchVisibility = (eventType: string) => {
    setSearchCardShown(eventType === "focus");
  };

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
              searchCardShown ? "pb-10" : ""
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
            <SearchResultsCard
              className="mt-10"
              onSearchCardShow={handleSearchVisibility}
              onSearchCardHide={handleSearchVisibility}
            />
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
