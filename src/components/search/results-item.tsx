import React from "react";
import { PodcastSearchResult } from "../../libs/itunes-podcast";
import { FetchedImage } from "../image";

type SearchResultItemProps = {
  result: PodcastSearchResult;
  className?: string;
};

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  className,
}) => {
  return (
    <div className={className}>
      <div className="h-16 flex hover:bg-background_light/20 hover:dark:bg-background_dark/20 p-1 cursor-pointer rounded-md transition">
        <div className="aspect-square">
          <FetchedImage
            src={result.artworkUrl600}
            alt={`${result.collectionName} artwork`}
            wrapperClassName="aspect-square rounded-md overflow-hidden"
          />
        </div>
        <div className="px-3 flex-grow">
          <div className="flex">
            <h3 className="flex-grow line-clamp-1">
              <div>{result.collectionName}</div>
            </h3>
            {result.trackExplicitness === "explicit" ? (
              <div className="pt-1 pl-1 inline text-[0.6rem] text-center text-red-300 shadow-black/100 font-bold uppercase">
                Explicit
              </div>
            ) : (
              ""
            )}
          </div>
          <h4 className="dark:text-white/50 text-sm line-clamp-1">
            {result.artistName}
          </h4>
        </div>
      </div>
    </div>
  );
};
