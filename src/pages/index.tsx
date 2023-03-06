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
        <div className="flex h-full flex-col bg-green-50/50 transition-colors dark:bg-black/70">
          <header className="py-6 px-8">
            {/* Nav bar */}
            <nav className={`flex h-12 w-full flex-col justify-center align-middle`}>
              <div className="flex justify-between">
                <div className="flex flex-col justify-center">
                  <Link href="/">
                    <div className="cursor-pointer rounded-sm bg-gray-900 py-0 px-2 align-middle font-black text-primary_light-300 dark:bg-white/50 dark:text-gray-900">
                      Poddy McPodface
                    </div>
                  </Link>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center justify-end gap-8">
                    <Link href="/login">
                      <a className="font-bold transition hover:text-black/80 dark:hover:text-gray-300">
                        Sign in
                      </a>
                    </Link>
                    <Link href="/signup">
                      <a className="rounded-lg bg-green-500 px-4 py-2 font-bold transition duration-150 hover:bg-green-600 dark:bg-green-900 dark:hover:bg-green-800">
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
              className={`h-half-screen flex max-h-[128rem] flex-col justify-end transition-all duration-300 ease-out ${
                searchCardShown ? "h-72 pb-10" : ""
              }`}
            >
              <div>
                <h1 className="text-center text-4xl font-extrabold dark:text-white/80">
                  Listen Everywhere
                </h1>
                <h2 className="mt-1 text-center text-lg dark:font-light dark:text-white/50">
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
