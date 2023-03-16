import type { NextPage } from "next";
import { useState } from "react";
import { SearchResultsCard } from "@/components/search/results-card";
import { DefaultFooter } from "@/components/footer";
import { AnimatedLayout } from "@/layouts/animated";
import { NavBar } from "@/components/nav";

const NuHome: NextPage = () => {
  const [searchCardShown, setSearchCardShown] = useState(false);

  const handleSearchVisibility = (eventType: string) => {
    setSearchCardShown(eventType === "focus");
  };

  return (
    <AnimatedLayout>
      <div className="h-full overflow-y-scroll bg-[url('../data/slanted-thumbs-gradient.png')] bg-cover bg-no-repeat bg-blend-color-burn">
        <div className="flex h-full flex-col bg-green-50/50 transition-colors dark:bg-black/70">
          <NavBar />
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
