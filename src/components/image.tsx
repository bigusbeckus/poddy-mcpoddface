/* eslint-disable @next/next/no-img-element */
import { FC, ReactNode, useState } from "react";
import { ProgressCircular } from "./progress/progress-circular";

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
      className={`relative ${fill ? "w-full h-full" : ""} ${
        wrapperClassName ? wrapperClassName : ""
      }`}
    >
      <img
        src={src}
        alt={alt}
        className={`${imgClassName} object-cover h-full w-full transition duration-500 ${
          loading ? "opacity-0" : ""
        }`}
        onLoad={handleImgLoad}
      />
      {placeholder || (
        <div
          className={`bg-white/20 absolute top-0 left-0 w-full h-full flex justify-center items-center transition duration-500 ${
            !loading ? "opacity-0" : ""
          }`}
        >
          <ProgressCircular />
        </div>
      )}
    </div>
  );
};
