/* eslint-disable @next/next/no-img-element */
import { type FC, type ReactNode, useState, useRef, useEffect } from "react";
import { ProgressCircular } from "@/components/progress/progress-circular";

type ImageProps = {
  src: string;
  fallback?: string;
  alt: string;
  wrapperClassName?: string;
  imgClassName?: string;
  fill?: boolean;
  placeholder?: ReactNode;
};

export const FetchedImage: FC<ImageProps> = ({
  src,
  fallback,
  alt,
  imgClassName,
  fill,
  placeholder,
  wrapperClassName,
}) => {
  const [loading, setLoading] = useState(true);
  const imgElementRef = useRef(null as HTMLImageElement | null);

  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  function handleImgLoad() {
    setLoading(false);
  }

  function handleImgError() {
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
    } else {
      // Give up because both `src` and `fallback` failed to load
      setLoading(false);
    }
  }

  return (
    <div
      className={`relative ${fill ? "h-full w-full" : ""} ${
        wrapperClassName ? wrapperClassName : ""
      }`}
    >
      <img
        ref={imgElementRef}
        src={imageSrc}
        alt={alt}
        onLoad={handleImgLoad}
        onError={handleImgError}
        className={`${imgClassName} h-full w-full object-cover transition duration-500 ${
          loading ? "opacity-0" : ""
        }`}
      />
      {placeholder || (
        <div
          className={`absolute top-0 left-0 flex h-full w-full items-center justify-center bg-white/20 transition duration-500 ${
            !loading ? "opacity-0" : ""
          }`}
        >
          <ProgressCircular />
        </div>
      )}
    </div>
  );
};
