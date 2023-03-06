import { atom, useAtom } from "jotai";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw, SkipBack, SkipForward } from "react-feather";
import { FetchedImage } from "./image";

type Media = {
  track: {
    url: string;
    title: string;
    artworkUrl: string;
    duration?: number;
  };
  podcast: {
    title: string;
    url: string;
    collectionId: number;
  };
};

type PlayerProps = {
  className?: string;
};

export const audioElementAtom = atom(null as HTMLAudioElement | null);
export const mediaAtom = atom(undefined as Media | undefined);

const playbackStateAtom = atom("none" as PlaybackState);

type PlaybackState = "playing" | "paused" | "stopped" | "none";
type PlaybackAction = {
  type: "play" | "stop" | "pause" | "clear";
};

function playbackReducer(state: PlaybackState, action: PlaybackAction) {
  switch (action.type) {
    case "play": {
      return "playing";
    }
    case "pause": {
    }
    case "stop": {
    }
    case "clear": {
    }
  }
}

export function usePlayback() {
  const [media, setMedia] = useAtom(mediaAtom);
  // const [playbackState, setPlaybackState] = useState("none" as PlaybackState);
  const [playbackState, setPlaybackState] = useAtom(playbackStateAtom);
  // const [media, setMedia] = useState(undefined as Media | undefined);
  const [audioElement] = useAtom(audioElementAtom);

  const handleOnPlay = useCallback((e: Event) => {
    console.log(e);
  }, []);

  useEffect(() => {
    audioElement?.addEventListener("play", handleOnPlay);
  }, [audioElement, handleOnPlay]);

  async function setTrack(media: Media) {
    if (!audioElement) {
      return false;
    }

    if (audioElement.src === media.track.url) {
      return true;
    }

    audioElement.src = media.track.url;
    audioElement.load();
    setMedia(media);
    setPlaybackState("playing");
  }

  function play() {
    if (!(media && audioElement)) {
      // No media to play, do nothing
      return false;
    }
    // Resume currently playing track
    audioElement.play();
    setPlaybackState("playing");
    return true;
  }

  function pause(): boolean {
    if (!(media && audioElement)) {
      return false;
    }
    // Pause currently playing track
    audioElement.pause();
    setPlaybackState("paused");
    return true;
  }

  function stop() {
    if (!(media && audioElement)) {
      // No media to play, do nothing
      return false;
    }
    // Pause currently playing track and reset position
    audioElement.pause();
    audioElement.currentTime = 0;
    setPlaybackState("stopped");
    return true;
  }

  function seekForward() {
    throw new Error("Not Implemented");
  }

  function seekBackward() {
    throw new Error("Not Implemented");
  }

  function clearSource() {
    if (!audioElement) {
      return false;
    }
    audioElement.src = "";
    audioElement.load();
    setMedia(undefined);
    setPlaybackState("none");
  }

  function setVolume() {
    throw new Error("Not Implemented");
  }

  // Convert to getter if possible
  function isMuted() {
    if (!audioElement) {
      return false;
    }
    return audioElement.volume === 0;
  }

  function isPlaying() {
    if (!audioElement) {
      return false;
    }

    return (
      !!audioElement.currentSrc &&
      !(audioElement.paused || audioElement.ended) &&
      audioElement.readyState > 2
    );
  }

  return {
    setTrack,
    clearSource,
    current: {
      media: useAtom(mediaAtom)[0],
      // media,
      isMuted: useState(isMuted())[0],
      // isPlaying: useState(isPlaying())[0],
      playbackState: useAtom(playbackStateAtom)[0],
      controls: {
        play,
        pause,
        stop,
        seekForward,
        seekBackward,
        setVolume,
      },
    },
  };
}

export const Player: React.FC<PlayerProps> = ({ className }) => {
  const audioElementRef = useRef(null as HTMLAudioElement | null);
  const [expand, setExpand] = useState(true);
  const setAudioElement = useAtom(audioElementAtom)[1];
  const playback = usePlayback();

  useEffect(() => {
    setAudioElement(audioElementRef.current);
    console.log(audioElementRef);
  }, [setAudioElement]);

  function handlePlaybackToggle() {
    const playbackState = playback.current.playbackState;
    if (playbackState === "playing") {
      playback.current.controls.pause();
    } else {
      playback.current.controls.play();
    }
  }

  function handleStop() {
    playback.current.controls.stop();
  }

  function handleClear() {
    playback.clearSource();
  }

  function handleExpandToggle() {
    setExpand(!expand);
  }

  return (
    <div
      className={`${!!playback.current.media || expand ? "" : "h-0"} ${
        className ?? ""
      } bottom-0 z-50 overflow-hidden rounded-t-md bg-gray-900 p-2 outline outline-1 outline-white/10 transition-all`}
    >
      <audio ref={audioElementRef} autoPlay playsInline preload="none" />
      <div className="flex h-32">
        <div className="h-full w-32 overflow-hidden rounded-md bg-gray-900 outline outline-1 outline-white/10">
          {playback.current.media ? (
            <FetchedImage
              src={playback.current.media.track.artworkUrl ?? ""}
              alt={`${playback.current.media?.track.title ?? ""} thumbnail`}
              imgClassName="w-full"
              fill
            />
          ) : (
            <div className="h-full w-32 rounded-md bg-white/10"></div>
          )}
        </div>

        <div className="grid flex-1 grid-cols-1 grid-rows-2 px-4">
          <div className="row-span-1 flex flex-col justify-center">
            <h2 className="font-bold">{playback.current.media?.track.title ?? "-"}</h2>
            <div className="text-gray-400">
              <Link
                href={
                  playback.current.media
                    ? `/podcast/${playback.current.media?.podcast.collectionId}`
                    : "#"
                }
              >
                <span className="cursor-pointer underline-offset-4 hover:underline">
                  {playback.current.media?.podcast.title ?? "-"}
                </span>
              </Link>
            </div>
          </div>

          {/* Media controls */}
          <div className="row-span-1 flex flex-col justify-center">
            <div className="flex gap-8">
              <button>
                <SkipBack size={20} className="fill-white" />
              </button>
              <button>
                <RotateCcw size={20} />
              </button>
              <button onClick={handlePlaybackToggle} className="rounded-full bg-white p-2">
                {playback.current.playbackState === "playing" ? (
                  <Pause size={20} className="fill-black stroke-none" />
                ) : (
                  <Play size={20} className="fill-black stroke-none" />
                )}
              </button>
              <button>
                <RotateCw size={20} />
              </button>
              <button>
                <SkipForward size={20} className="fill-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Milestones
// ==========
// 1. Play audio from component
//    - Pass feed url to component
// 2. Toggle playback
// 3. Start playback from other component
// 4. Seek
// 5. Playback progress