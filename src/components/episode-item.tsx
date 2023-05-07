import { FetchedImage } from "components/image";
import React, { type MouseEvent, useState } from "react";
import { PodcastDescription } from "@/components/podcast-description";
import { formatHmsDuration, secondsToHms } from "@/libs/util/converters";
import { Pause, Play } from "react-feather";
import { usePlayback } from "@/components/player";

type EpisodeItemProps = {
  title: string;
  description?: string;
  url: string;
  artworkUrl: string;
  duration?: number;
  releaseDate: Date | null;
  podcast: {
    title: string;
    url: string;
    collectionId: number;
    artworkUrl: string;
  };
  onClick: () => void;
};

export const EpisodeItem: React.FC<EpisodeItemProps> = (props) => {
  const playback = usePlayback();
  const [isHovered, setIsHovered] = useState(false);
  const [isThumbHovered, setIsThumbHovered] = useState(false);
  const isCurrentTrack = playback.current.media && playback.current.media.track.url === props.url;
  const isCurrentlyPlaying = isCurrentTrack && playback.current.element.playbackState === "playing";

  function handleOnClick() {
    props.onClick();
  }

  function handleHover(hover: boolean) {
    setIsHovered(hover);
  }

  function handleThumbHover(hover: boolean) {
    setIsThumbHovered(hover);
  }

  function handleThumbClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!isCurrentTrack) {
      playback.setTrack({
        track: {
          url: props.url,
          title: props.title,
          artworkUrl: props.artworkUrl,
          duration: props.duration,
        },
        podcast: {
          title: props.podcast.title,
          url: props.podcast.url,
          artworkUrl: props.podcast.artworkUrl,
          collectionId: props.podcast.collectionId,
        },
      });
    } else if (playback.current.element.playbackState === "playing") {
      playback.current.controls.pause();
    } else {
      playback.current.controls.play();
    }
  }

  return (
    <div
      className={`cursor-pointer overflow-hidden transition-colors hover:bg-black/20 ${
        isCurrentTrack ? "dark:bg-gray-900" : "hover:dark:bg-gray-900"
      }`}
      onClick={handleOnClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="flex p-2">
        <div className="relative h-32 w-32 shrink-0 grow-0 overflow-hidden outline outline-1 outline-white/10">
          <div
            className={`absolute z-10 h-full w-full cursor-default bg-white/20 ${
              isHovered || isCurrentTrack ? "" : "opacity-0"
            }`}
            onMouseEnter={() => handleThumbHover(true)}
            onMouseLeave={() => handleThumbHover(false)}
          >
            <button
              disabled={!isHovered}
              className="flex h-full w-full items-center justify-center"
              onClick={handleThumbClick}
            >
              <div
                className={`flex items-center justify-center rounded-full p-4 shadow-black/70 outline outline-1 outline-white/10 backdrop-blur-sm transition-all ${
                  isThumbHovered ? "bg-black/50" : "bg-black/40"
                }`}
              >
                {isCurrentlyPlaying ? (
                  <Pause size={20} className="fill-white stroke-none" />
                ) : (
                  <Play size={20} className="fill-white stroke-none" />
                )}
              </div>
            </button>
          </div>
          <FetchedImage
            src={props.artworkUrl}
            fallback={props.podcast.artworkUrl}
            alt={`${props.title} thumbnail`}
            imgClassName="w-full"
            fill
          />
        </div>
        <div className="grid flex-grow grid-rows-4 px-4">
          <div className="row-span-1 flex justify-between">
            <div className="text-lg line-clamp-1">{props.title}</div>
            {props.releaseDate && (
              <div className="text-sm text-gray-500">
                {new Date(props.releaseDate).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            )}
          </div>
          <div className="row-span-2 py-1 text-sm dark:text-gray-500">
            <PodcastDescription description={props.description} className="line-clamp-2" />
          </div>
          <div className="row-span-1 flex justify-between">
            <div className="align-text-bottom text-sm text-gray-300">
              {props.duration
                ? formatHmsDuration(secondsToHms(props.duration), {
                    omitIfZero: ["hours"],
                    noZeroPadding: ["hours"],
                    style: "text",
                  })
                : "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
