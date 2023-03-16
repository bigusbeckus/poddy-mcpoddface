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
      <div className="flex h-16 cursor-pointer rounded-md p-1 transition hover:bg-background_light/20 hover:dark:bg-background_dark/20">
        <div className="aspect-square">
          <FetchedImage
            src={result.artworkUrl600}
            alt={`${result.collectionName} artwork`}
            wrapperClassName="aspect-square rounded-md overflow-hidden"
          />
        </div>
        <div className="flex-grow px-3">
          <div className="flex">
            <h3 className="flex-grow line-clamp-1">
              <div>{result.collectionName}</div>
            </h3>
            {result.trackExplicitness === "explicit" ? (
              <div className="inline pt-1 pl-1 text-center text-[0.6rem] font-bold uppercase text-red-300 shadow-black/100">
                Explicit
              </div>
            ) : (
              ""
            )}
          </div>
          <h4 className="text-sm line-clamp-1 dark:text-white/50">{result.artistName}</h4>
        </div>
      </div>
    </div>
  );
};
