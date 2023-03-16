import React from "react";
import { type PodcastSearchResult } from "@/libs/itunes-podcast";
import { FetchedImage } from "@/components/image";

type SearchResultItemProps = {
  result: PodcastSearchResult;
  className?: string;
};

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, className }) => {
  return (
    <div className={className}>
      <div className="flex h-16 cursor-pointer overflow-hidden rounded-md p-1 transition hover:bg-background_light/20 hover:dark:bg-background_dark/20">
        <div className="aspect-square h-full overflow-hidden rounded">
          <FetchedImage
            src={result.artworkUrl600}
            alt={`${result.collectionName} artwork`}
            imgClassName="w-full"
            fill
          />
        </div>
        <div className="grid flex-1 grid-rows-2 px-3">
          <div className="row-span-1 flex">
            <div className="flex-grow">
              <h3 className="text-ellipsis line-clamp-1">{result.collectionName}</h3>
            </div>
            {result.trackExplicitness === "explicit" ? (
              <div className="inline pt-1 pl-1 text-center text-[0.6rem] font-bold uppercase text-red-300 shadow-black/100">
                Explicit
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="row-span-1">
            <h4 className="text-ellipsis text-sm line-clamp-1 dark:text-white/50">
              {result.artistName}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
