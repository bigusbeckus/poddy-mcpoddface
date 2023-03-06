export function parseDurationSeconds(duration: string) {
  try {
    if (!(duration && duration.includes(":"))) {
      return undefined;
    }

    let str = duration;
    if (duration.includes(".")) {
      str = duration.slice(0, duration.indexOf("."));
    }
    const fragments = str.split(":");
    const endIndex = fragments.length - 1;
    let seconds = 0;
    for (let i = endIndex; i >= 0; i--) {
      const value = parseInt(fragments[i]);
      // Seconds
      if (endIndex - i === 0) {
        seconds += value;
      }
      // Minutes
      else if (endIndex - i === 1) {
        seconds += value * 60;
      }
      // Hours
      else if (endIndex - i === 2) {
        seconds += value * 3600;
      }
    }
    return seconds;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export function getDurationString(duration: number) {
  let durationString = "",
    hours = 0,
    minutes = 0,
    seconds = 0;
  if (duration > 3600) {
    hours = Math.floor(duration / 3600);
    duration -= hours * 3600;
    durationString += `${hours}`;
  }
  if (duration > 60) {
    minutes = Math.floor(duration / 60);
    duration -= minutes * 60;
    durationString += `${hours > 0 ? ":" : ""}${minutes
      .toString()
      .padStart(2, "0")}`;
  }
  seconds = duration;
  durationString += `${hours > 0 || minutes > 0 ? ":" : ""}${seconds
    .toString()
    .padStart(2, "0")}`;
  return durationString;
}
