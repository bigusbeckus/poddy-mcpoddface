import Link from "next/link";
import { NextPage } from "next";
import { useState } from "react";
import { SearchResultsCard } from "components/search/results-card";
import { DefaultFooter } from "components/footer";
import { AnimatedLayout } from "layouts/animated";

const NuHome: NextPage = () => {
  const [searchCardShown, setSearchCardShown] = useState(false);

  const handleSearchVisibility = (eventType: string) => {
    setSearchCardShown(eventType === "focus");
  };

  return (
    <AnimatedLayout>
      <div className="h-full overflow-y-scroll bg-[url('../data/slanted-thumbs-gradient.png')] bg-cover bg-no-repeat bg-blend-color-burn">
        <div className="h-full bg-green-50/50 dark:bg-black/70 transition-colors flex flex-col">
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
                <div className="flex flex-col justify-center">
                  <div className="flex justify-end items-center gap-8">
                    <Link href="/login">
                      <a className="font-bold hover:text-black/80 dark:hover:text-gray-300 transition">
                        Sign in
                      </a>
                    </Link>
                    <Link href="/signup">
                      <a className="font-bold bg-green-500 hover:bg-green-600 dark:bg-green-900 dark:hover:bg-green-800 px-4 py-2 rounded-lg transition duration-150">
                        Create a new account
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          {/* Landing content */}
          <div className="flex-grow">
            <main
              className={`flex flex-col justify-end h-half-screen max-h-[128rem] transition-all ease-out duration-300 ${
                searchCardShown ? "pb-10 h-72" : ""
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
            </main>
          </div>
          {/* Footer */}
          <DefaultFooter />
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default NuHome;
