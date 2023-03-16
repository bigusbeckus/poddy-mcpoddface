/* eslint-disable @next/next/no-img-element */
import { type FC, type ReactNode, useState } from "react";
import { ProgressCircular } from "@/components/progress/progress-circular";

type ImageProps = {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imgClassName?: string;
  fill?: boolean;
  placeholder?: ReactNode;
};

export const FetchedImage: FC<ImageProps> = ({
  src,
  alt,
  imgClassName,
  fill,
  placeholder,
  wrapperClassName,
}) => {
  const [loading, setLoading] = useState(true);

  function handleImgLoad() {
    setLoading(false);
  }

  return (
    <div
      className={`relative ${fill ? "h-full w-full" : ""} ${
        wrapperClassName ? wrapperClassName : ""
      }`}
    >
      <img
        src={src}
        alt={alt}
        className={`${imgClassName} h-full w-full object-cover transition duration-500 ${
          loading ? "opacity-0" : ""
        }`}
        onLoad={handleImgLoad}
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
