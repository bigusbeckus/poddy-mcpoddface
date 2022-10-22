import { Dialog } from "@headlessui/react";
import Link from "next/link";
import React, { useState } from "react";
import { PodcastResult } from "../libs/itunes-podcast";
import { FetchedImage } from "./image";
import { Modal } from "./modal";

type PodcastListProps = {
  podcasts: PodcastResult[];
  view?: string;
};

export const PodcastList: React.FC<PodcastListProps> = ({ podcasts, view }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selection, setSelection] = useState(null as PodcastResult | null);

  function handleItemClick(item: PodcastResult) {
    setSelection(item);
    setDialogOpen(true);
  }

  const modal = (
    <Modal
      key={selection ? selection.collectionId : ""}
      state={[dialogOpen, setDialogOpen]}>
      <Dialog.Panel className="w-full max-w-md p-8 rounded-md bg-white dark:bg-gray-700">
        {selection ? (
          <div key={selection.collectionId}>
            <Dialog.Title as="h3" className="text-xl font-black">
              {selection.collectionName}
            </Dialog.Title>
            <div className="border-solid border-2 border-white/20 p-2 rounded-md">
              {selection.genres.map((genre) => (
                <div key={genre}>{genre}</div>
              ))}
            </div>
            <Link
              href={{
                pathname: `/podcast/${selection.collectionId}`,
              }}
              className="hover:underline">
              Details
            </Link>
          </div>
        ) : (
          <div>Nothing selected</div>
        )}
      </Dialog.Panel>
    </Modal>
  );

  if (view === "list") {
    return (
      <>
        {/* {modal} */}
        <div className="">
          {podcasts.map((result) => (
            <Link
              key={result.collectionId}
              href={{
                pathname: `/podcast/${result.collectionId}`,
              }}>
              <div
                key={result.collectionId}
                // onClick={() => handleItemClick(result)}
                className="h-32 flex hover:bg-background_light/20 hover:dark:bg-background_dark/20 p-1 cursor-pointer rounded-md transition duration-300">
                {/* <img
                src={result.artworkUrl600}
                className="h-full rounded-md col-auto"
              /> */}
                <FetchedImage
                  src={result.artworkUrl600}
                  alt={`${result.collectionName} artwork`}
                  className="h-full aspect-square overflow-hidden rounded-md col-auto"
                />
                <div className="p-2">
                  <h3 className="text-xl font-extrabold">
                    {result.collectionName}
                    {`${
                      result.trackExplicitness === "explicit"
                        ? " (Explicit)"
                        : ""
                    }`}
                  </h3>
                  <a
                    className="hover:underline"
                    href={result.artistViewUrl}
                    onClick={(e) => e.stopPropagation()}>
                    {result.artistName}
                  </a>
                  {/* <Link href={result.artistViewUrl}>
                  <a>{result.artistName}</a>
                </Link> */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* {modal} */}
      <div className="grid grid-cols-8 gap-1">
        {podcasts.map((result) => (
          <Link
            key={result.collectionId}
            href={{
              pathname: `/podcast/${result.collectionId}`,
            }}>
            <div
              key={result.collectionId}
              // onClick={() => handleItemClick(result)}
              className="hover:bg-background_light/20 hover:dark:bg-background_dark/20 p-1 cursor-pointer rounded-md transition duration-300">
              {/* <img src={result.artworkUrl600} className="w-full rounded-md aspect-square object-cover" /> */}
              <FetchedImage
                src={result.artworkUrl600}
                alt={`${result.collectionName} artwork`}
                className="w-full rounded-md aspect-square overflow-hidden"
              />
              <div className="mt-2 leading-tight text-center text-ellipsis">
                {result.collectionName}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
