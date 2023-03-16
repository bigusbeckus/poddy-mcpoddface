import { useState } from "react";

type DebounceParams = { lastInvoked: number; executeHandler: NodeJS.Timeout };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => any>(fn: T, debounceMs = 500): T {
  const [debounceParams, setDebounceParams] = useState<DebounceParams | undefined>();

  const [fnReturn, setFnReturn] = useState<ReturnType<T>>();

  function debounce(...args: Parameters<T>): ReturnType<T> {
    setDebounceParams({
      lastInvoked: new Date().valueOf(),
      executeHandler: setTimeout(() => {
        setFnReturn(fn(...args));
        setDebounceParams(undefined);
      }, debounceMs),
    });
    return fnReturn as ReturnType<T>;
  }

  function reset(debounceParams: DebounceParams, ...args: Parameters<T>) {
    clearTimeout(debounceParams.executeHandler);
    return debounce(...args);
  }

  return ((...args: Parameters<T>) => {
    // Has been invoked before
    if (debounceParams) {
      // If invoked less than [debounceMs] ago, reset
      const now = new Date().valueOf();
      if (now - debounceParams.lastInvoked < debounceMs) {
        return reset(debounceParams, ...args);
      } else {
        return fnReturn as ReturnType<T>;
      }
    } // First invocation
    else {
      return debounce(...args);
    }
  }) as T;
}
