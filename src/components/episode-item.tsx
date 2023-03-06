import { FetchedImage } from "components/image";
import React, { MouseEvent, useState } from "react";
import { PodcastDescription } from "./podcast-description";
import { getDurationString } from "libs/util/converters";
import { Pause, Play } from "react-feather";
import { usePlayback } from "./player";

type EpisodeItemProps = {
  title: string;
  description?: string;
  url: string;
  artworkUrl: string;
  duration?: number;
  podcast: {
    title: string;
    url: string;
    collectionId: number;
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
      className={`cursor-pointer overflow-clip rounded-lg transition-colors hover:bg-black/20 hover:dark:bg-gray-800 ${
        isCurrentTrack ? "dark:bg-gray-800" : ""
      }`}
      onClick={handleOnClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="flex p-2">
        <div className="relative h-32 w-32 shrink-0 grow-0 overflow-hidden rounded-md outline outline-1 outline-white/10">
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
                className={`flex items-center justify-center rounded-full shadow-black/70 outline outline-1 outline-white/10 backdrop-blur-sm transition-all ${
                  isThumbHovered ? "bg-black/50 p-4" : "bg-black/40 p-3"
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
            alt={`${props.title} thumbnail`}
            imgClassName="w-full"
            fill
          />
        </div>
        <div className="grid flex-grow grid-rows-4 px-4">
          <div className="row-span-1 text-lg font-bold line-clamp-1">{props.title}</div>
          <div className="row-span-2 py-1 text-sm dark:text-gray-400">
            <PodcastDescription description={props.description} className="line-clamp-2" />
          </div>
          <div className="row-span-1 flex">
            {props.duration ? (
              <div className="align-text-bottom">{getDurationString(props.duration)}</div>
            ) : (
              "--:--:--"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
