import { atom, useAtom } from "jotai";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw, SkipBack, SkipForward } from "react-feather";
import { FetchedImage } from "@/components/image";
import * as Slider from "@radix-ui/react-slider";
import { formatHmsDuration, secondsToHms } from "@/libs/util/converters";
import { useLocalSettings } from "@/hooks/use-local-settings";

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
    artworkUrl: string;
    collectionId: number;
  };
};

type PlayerProps = {
  className?: string;
};

export const audioElementAtom = atom(null as HTMLAudioElement | null);
export const mediaAtom = atom(undefined as Media | undefined);
export const currentTimeAtom = atom(0);

const playbackStateAtom = atom("none" as PlaybackState);

type PlaybackState =
  | "buffering"
  | "playing"
  | "paused"
  | "stopped"
  | "aborted"
  | "error"
  | "seeking"
  | "none";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logPlayerEvent(event: string, ...details: any[]) {
  if (details) {
    console.log("Player event:", event, ...details);
  } else {
    console.log("Player event:", event);
  }
}

export function usePlayback() {
  const [media, setMedia] = useAtom(mediaAtom);
  // const [playbackState, setPlaybackState] = useState("none" as PlaybackState);
  const [playbackState, setPlaybackState] = useAtom(playbackStateAtom);
  const [beforeSeekPlaybackState, setBeforeSeekPlaybackState] = useState(playbackState);
  // const [media, setMedia] = useState(undefined as Media | undefined);
  const [audioElement] = useAtom(audioElementAtom);

  const [bufferedTime, setBufferedTime] = useState(0);

  const currentTime = useRef(0);
  const [currentTimeState, setCurrentTimeState] = useState(currentTime.current);

  const setCurrentTime = useCallback((time: number) => {
    currentTime.current = time;
    setCurrentTimeState(time);
  }, []);

  const handlePlay = useCallback((e: Event) => {
    logPlayerEvent("play");
    // console.log(e);
  }, []);

  const handleProgress = useCallback(() => {
    logPlayerEvent("progress");
    // setBufferedTime((e.target as HTMLAudioElement).buffered.end(0));
    if (!audioElement) {
      return;
    }
    try {
      setBufferedTime(audioElement.buffered.end(audioElement.buffered.length - 1));
    } catch (error) {
      setBufferedTime(currentTime.current);
    }
  }, [audioElement]);

  const handleTimeUpdate = useCallback(
    (e: Event) => {
      logPlayerEvent(
        "timeupdate",
        "currentTime:",
        (e.target as HTMLAudioElement).currentTime,
        "currentTime (state):",
        currentTime.current
        // "duration:",
        // audioElement?.duration
      );
      if (playbackState !== "seeking") {
        setCurrentTime((e.target as HTMLAudioElement).currentTime);
      }
    },
    [playbackState, setCurrentTime]
  );

  const handleSeeking = useCallback(() => {
    logPlayerEvent(
      "seeking",
      "playbackState:",
      playbackState,
      "beforeSeekPlaybackState",
      beforeSeekPlaybackState
    );
    const prev = playbackState;
    setPlaybackState("seeking");
    setBeforeSeekPlaybackState(prev);
  }, [playbackState, setPlaybackState, beforeSeekPlaybackState]);

  const handleSeeked = useCallback(
    (e: Event) => {
      logPlayerEvent(
        "seeked",
        "playbackState:",
        playbackState,
        "beforeSeekPlaybackState:",
        beforeSeekPlaybackState,
        "currentTime):",
        (e.target as HTMLAudioElement).currentTime,
        "currentTime (state):",
        currentTime.current
      );
      setPlaybackState(beforeSeekPlaybackState);
      setCurrentTime((e.target as HTMLAudioElement).currentTime);
    },
    [setPlaybackState, beforeSeekPlaybackState, playbackState, setCurrentTime]
  );

  useEffect(() => {
    audioElement?.addEventListener("play", handlePlay);
    audioElement?.addEventListener("progress", handleProgress);
    audioElement?.addEventListener("timeupdate", handleTimeUpdate);
    audioElement?.addEventListener("seeking", handleSeeking);
    audioElement?.addEventListener("seeked", handleSeeked);

    return () => {
      audioElement?.removeEventListener("play", handlePlay);
      audioElement?.removeEventListener("progress", handleProgress);
      audioElement?.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement?.removeEventListener("seeking", handleSeeking);
      audioElement?.removeEventListener("seeked", handleSeeked);
    };
  }, [audioElement, handlePlay, handleProgress, handleTimeUpdate, handleSeeking, handleSeeked]);

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
    setBufferedTime(0);
    setCurrentTime(0);
    setPlaybackState("playing");
    return true;
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
    setCurrentTime(0);
    setPlaybackState("stopped");
    return true;
  }

  function skipForward(offset: number) {
    if (audioElement) {
      return seek(audioElement.currentTime + offset);
    }
    return false;
  }

  function skipBackward(offset: number) {
    if (audioElement) {
      return seek(audioElement.currentTime - offset);
    }
    return false;
  }

  function seek(timestamp: number) {
    if (!media || !audioElement || isNaN(audioElement.duration)) {
      // No media or duration hasn't been detrmined yet, do nothing
      return false;
    }
    // Set current time
    audioElement.currentTime = Math.min(audioElement.duration, Math.max(0, timestamp));
    setCurrentTime(audioElement.currentTime);
    return true;
  }

  function clearSource() {
    if (!audioElement) {
      return false;
    }
    audioElement.src = "";
    audioElement.load();
    setMedia(undefined);
    setPlaybackState("none");
    setBufferedTime(0);
    setCurrentTime(0);
    return true;
  }

  function setVolume() {
    throw new Error("Not Implemented");
  }

  const getBufferedTime = useCallback(() => {
    const bufferLength = audioElement?.buffered.length;
    if (bufferLength && bufferLength > 0) {
      return audioElement.buffered.end(audioElement.buffered.length - 1);
    }
    return 0;
  }, [audioElement?.buffered]);

  return {
    setTrack,
    clearSource,
    current: {
      media: useAtom(mediaAtom)[0],
      element: {
        playbackState: useAtom(playbackStateAtom)[0],
        currentTime: audioElement?.currentTime || 0,
        bufferedTime: getBufferedTime(),
        duration: audioElement?.duration,
      },
      isMuted: !!(audioElement?.volume === 0),
      controls: {
        play,
        pause,
        stop,
        seek,
        skipForward,
        skipBackward,
        setVolume,
      },
    },
  };
}

function PlayerProgress() {
  const playback = usePlayback();
  const duration = playback.current.element.duration;
  const bufferedTime = playback.current.element.bufferedTime;
  const currentTime = playback.current.element.currentTime;

  const [sliderTargetValue, setSliderTargetValue] = useState(currentTime);
  const [autoUpdateSliderValue, setAutoUpdateSliderValue] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    console.log("currenttime effect:", currentTime);
    if (autoUpdateSliderValue) {
      setSliderTargetValue(currentTime);
    }
  }, [autoUpdateSliderValue, currentTime]);

  const durationString = duration
    ? formatHmsDuration(secondsToHms(duration), { omitIfZero: ["hours"], noZeroPadding: ["hours"] })
    : "0:00";
  const currentTimeString = duration
    ? formatHmsDuration(secondsToHms(currentTime), {
        omitIfZero: ["hours"],
        noZeroPadding: ["hours"],
      })
    : "0:00";
  const sliderTimeString =
    sliderTargetValue === currentTime
      ? currentTimeString
      : duration
      ? formatHmsDuration(secondsToHms(sliderTargetValue), {
          omitIfZero: ["hours"],
          noZeroPadding: ["hours"],
        })
      : "0:00";

  const bufferSizePercent = useMemo(
    () => (duration && duration > 0 ? (bufferedTime / duration) * 100 : 0),
    [duration, bufferedTime]
  );
  // const playbackPercent = useMemo(
  //   () => (duration && duration > 0 ? (Math.floor(currentTime) / duration) * 100 : 0),
  //   [duration, currentTime]
  // );
  // const sliderValuePercent = useMemo(
  //   () => (duration && duration > 0 ? (Math.floor(sliderTargetValue) / duration) * 100 : 0),
  //   [duration, sliderTargetValue]
  // );
  const sliderPopupLeft =
    duration && duration > 0 ? (Math.floor(sliderTargetValue) / duration) * 100 : 0;

  function onSliderValueChanged(values: number[]) {
    const sliderValue = values[0];
    console.log("slidervaluechange");
    setSliderTargetValue(sliderValue);
    setAutoUpdateSliderValue(false);
    setIsDragging(true);
  }

  function onSliderValueCommit(values: number[]) {
    const sliderValue = values[0];
    console.log("slidervaluecommit");
    playback.current.controls.seek(sliderValue);
    setAutoUpdateSliderValue(true);
    setIsDragging(false);
  }

  return (
    <div className="flex w-full items-center">
      <div className="h-full w-16 pr-2 text-xs text-gray-300">{currentTimeString}</div>
      <Slider.Root
        className="relative flex h-full grow cursor-pointer touch-none select-none items-center"
        aria-label="Playback progress"
        defaultValue={[0]}
        step={1}
        max={duration ? Math.floor(duration) : 1}
        value={[duration && duration > 0 ? Math.floor(sliderTargetValue) : 0]}
        onValueChange={onSliderValueChanged}
        onValueCommit={onSliderValueCommit}
      >
        <Slider.Track className="relative flex h-4 grow items-center">
          <div
            className={`${
              isDragging ? "" : "hidden"
            } absolute bottom-0 z-10 mb-4 rounded-md bg-green-700/95 px-2 py-1`}
            style={{ left: `calc(${sliderPopupLeft}%`, transform: `translateX(-50%)` }}
          >
            {sliderTimeString}
          </div>
          <Slider.Track className="absolute h-1 w-full rounded-full bg-gray-800" />
          <Slider.Track
            className="absolute h-1 rounded-full bg-gray-600"
            style={{ width: `${bufferSizePercent}%` }}
          />
          <Slider.Range className="absolute h-1 rounded-l-full bg-green-400" />
        </Slider.Track>
        <Slider.Thumb className="block h-4 w-4 rounded-full bg-white shadow-md shadow-black/70 hover:shadow-md hover:outline-none focus:outline-none active:outline-none" />
      </Slider.Root>
      <div className="h-full w-16 pl-2 text-right text-xs text-gray-300">{durationString}</div>
    </div>
  );
}

export const Player: React.FC<PlayerProps> = ({ className }) => {
  const audioElementRef = useRef(null as HTMLAudioElement | null);
  const [expand, setExpand] = useState(true);
  const setAudioElement = useAtom(audioElementAtom)[1];
  const playback = usePlayback();
  const [settings, setPlayerStats] = useLocalSettings();

  useEffect(() => {
    setAudioElement(audioElementRef.current);
    // console.log(audioElementRef);
  }, [setAudioElement]);

  function handlePlaybackToggle() {
    const playbackState = playback.current.element.playbackState;
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
      className={`bottom-0 z-50 overflow-hidden bg-gray-900 transition-all duration-1000 ${
        !!playback.current.media ? "p-2 outline outline-1 outline-white/10" : "h-0"
      } ${className ?? ""}`}
    >
      <audio ref={audioElementRef} autoPlay playsInline preload="none" />
      <div className="flex h-32">
        <div className="h-full w-32 overflow-hidden bg-gray-900 outline outline-1 outline-white/10">
          {playback.current.media ? (
            <FetchedImage
              src={playback.current.media.track.artworkUrl ?? ""}
              fallback={playback.current.media.podcast.artworkUrl}
              alt={`${playback.current.media?.track.title ?? ""} thumbnail`}
              imgClassName="w-full"
              fill
            />
          ) : (
            <div className="h-full w-32 bg-white/10"></div>
          )}
        </div>

        <div className="grid flex-1 grid-cols-1 grid-rows-3 px-4">
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
          <div className="row-span-2 flex flex-col justify-center">
            {/* Controls */}
            <div className="flex gap-8">
              <button>
                <SkipBack size={20} className="fill-white" />
              </button>
              <button>
                <RotateCcw size={20} />
              </button>
              <button onClick={handlePlaybackToggle} className="rounded-full bg-white p-2">
                {playback.current.element.playbackState === "playing" ? (
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
              {/* Debug info */}
              {settings.enablePlayerStats && (
                <div className="fixed bottom-0 left-0 z-50 w-52 bg-black/30 p-4">
                  <div>
                    Duration:{" "}
                    {playback.current.element.duration
                      ? playback.current.element.duration.toFixed(2)
                      : 0}
                  </div>
                  <div>Current: {playback.current.element.currentTime.toFixed(2)}</div>
                  <div>Buffered: {playback.current.element.bufferedTime.toFixed(2)}</div>
                  <div>
                    Buffer %:{" "}
                    {playback.current.element.duration && playback.current.element.duration > 0
                      ? (
                          (playback.current.element.bufferedTime /
                            playback.current.element.duration) *
                          100
                        ).toFixed(2)
                      : 0}
                  </div>
                  <div>
                    Progress %:{" "}
                    {playback.current.element.duration && playback.current.element.duration > 0
                      ? (
                          (playback.current.element.currentTime /
                            playback.current.element.duration) *
                          100
                        ).toFixed(0)
                      : 0}
                  </div>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-5 w-full">
              <PlayerProgress />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Milestones
// ==========
// 1. Play audio from component - DONE
//    - Pass feed url to component
// 2. Toggle playback - DONE
// 3. Start playback from other component - DONE
// 4. Seek - IN PROGRESS
// 5. Playback progress - DONE
