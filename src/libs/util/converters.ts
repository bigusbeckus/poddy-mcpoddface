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

type DurationHms = {
  hours: number;
  minutes: number;
  seconds: number;
};

type FormatHmsDurationOptions = {
  omitIfZero?: Array<keyof DurationHms>;
  noZeroPadding?: Array<keyof DurationHms>;
  style?: "text" | "numeric";
};

export function secondsToHms(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor((duration % 3600) % 60);

  return {
    hours,
    minutes,
    seconds,
  } as DurationHms;
}

export function formatHmsDuration(duration: DurationHms, options?: FormatHmsDurationOptions) {
  const values: string[] = [];
  let key: keyof DurationHms;
  for (key in duration) {
    // if is zero and the key is in omitIfZero, skip
    // else, accept
    if (duration[key] === 0 && options?.omitIfZero?.includes(key)) {
      continue;
    }

    values.push(
      options?.noZeroPadding?.includes(key)
        ? duration[key].toString()
        : duration[key].toString().padStart(2, "0")
    );
  }

  if (options?.style === "text") {
    const suffixes = ["s", "m", "h"];
    return values
      .reverse()
      .map((value, index) => `${value}${suffixes[index]}`)
      .reverse()
      .join(" ");
  } else {
    return values.join(":");
  }
}
