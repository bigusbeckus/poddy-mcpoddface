import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { randomFromRange } from "@/libs/util/number";
// import { Button } from "components/button";

const progressBarSteps = [
  "w-[0.3%]",
  "w-[10%]",
  "w-[20%]",
  "w-[30%]",
  "w-[40%]",
  "w-[50%]",
  "w-[60%]",
  "w-[70%]",
  "w-[80%]",
  "w-[90%]",
  "w-[95%]",
  "w-[98%]",
];

type RouterProgresProps = {
  className?: string;
  isErrorPage?: boolean;
};

type RouterState = "loading" | "error" | "loaded" | "none";

export const RouterProgres: React.FC<RouterProgresProps> = ({ className, isErrorPage }) => {
  const router = useRouter();
  const [routerState, setRouterState] = useState<RouterState>("none");

  const loaderWrapper = useRef<HTMLDivElement>(null);
  const loaderProgress = useRef<HTMLDivElement>(null);

  const [progressBarCurrentStep, setProgressBarCurrentStep] = useState(0);

  let _className = className ? `${className} ` : "";

  if (routerState === "loading") {
    _className += `${progressBarSteps[progressBarCurrentStep]} rounded-r-md animate-pulse`;
  }

  if (routerState === "error") {
    _className += "w-full bg-red-700";
    setTimeout(() => setRouterState("none"), 500);
  }

  if (routerState === "loaded") {
    _className += "w-full";
    if (progressBarCurrentStep !== 0) {
      setProgressBarCurrentStep(0);
    }
    setTimeout(() => setRouterState("none"), 500);
  }

  if (routerState === "none") {
    _className += "opacity-0";
    if (progressBarCurrentStep !== 0) {
      setProgressBarCurrentStep(0);
    }
  }

  useEffect(() => {
    if (isErrorPage) {
      setRouterState("error");
    }
  }, [isErrorPage]);

  useEffect(() => {
    let timeoutId: number | undefined = undefined;
    if (routerState === "loading") {
      timeoutId = window.setTimeout(() => {
        setProgressBarCurrentStep((progressBarCurrentStep) =>
          Math.min(progressBarCurrentStep + 1, progressBarSteps.length - 1)
        );
      }, randomFromRange(700, 2000));
    }

    return () => clearTimeout(timeoutId);
  }, [routerState, progressBarCurrentStep]);

  useEffect(() => {
    const handleStart = (_url: string) => {
      setRouterState("loading");
    };
    const handleStop = (_url: string) => {
      setRouterState("loaded");
    };
    const handleError = (_url: string) => {
      setRouterState("error");
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleError);
    };
  }, [router]);

  return (
    <div ref={loaderWrapper} className="absolute h-0.5 w-full bg-transparent">
      <div
        ref={loaderProgress}
        className={`${_className} h-full rounded-r-md bg-green-500 transition-all duration-700 dark:bg-white`}
      ></div>
      {/*
      TODO: Put buttons behind a feature flag
      <div className="flex justify-center">
        <div>
          <Button onClick={() => setRouterState("loading")}>Set loading</Button>
          <Button onClick={() => setRouterState("loaded")}>Set loaded</Button>
          <Button onClick={() => setRouterState("error")}>Set error</Button>
          <Button onClick={() => setRouterState("none")}>Set none</Button>
          <div>Current: {routerState}</div>
        </div>
      </div>
      */}
    </div>
  );
};
