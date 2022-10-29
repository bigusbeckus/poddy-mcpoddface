import { useState } from "react";

type DebounceParams = { lastInvoked: number; refetchHandler: NodeJS.Timeout };

export function useDebounce(fn: () => void, debounceMs = 500) {
  const [debounceParams, setDebounceParams] = useState<
    DebounceParams | undefined
  >();

  function debounceQuery() {
    setDebounceParams({
      lastInvoked: new Date().valueOf(),
      refetchHandler: setTimeout(() => {
        fn();
        setDebounceParams(undefined);
      }, debounceMs),
    });
  }

  function resetDebounce(debounceParams: DebounceParams) {
    clearTimeout(debounceParams.refetchHandler);
    debounceQuery();
  }

  function debouncedFn() {
    // Has been invoked before
    if (debounceParams) {
      // If invoked less than [debounceMs] ago, reset
      const now = new Date().valueOf();
      if (now - debounceParams.lastInvoked < debounceMs) {
        resetDebounce(debounceParams);
      }
    }
    // First invocationu
    else {
      debounceQuery();
    }
  }

  return debouncedFn;
}
