/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";
import { ProgressCircular } from "./progress";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
};

export const FetchedImage: FC<ImageProps> = ({ src, alt, className, fill }) => {
  const [loading, setLoading] = useState(true);

  function handleImgLoad() {
    setLoading(false);
  }

  return (
    <div className={`relative ${fill ? "w-full h-full" : ""}`}>
      <img
        src={src}
        alt={alt}
        className={`object-cover w-full h-full transition duration-500 ${
          fill ? "w-full" : "h-full"
        } ${className} ${loading ? "opacity-0" : ""}`}
        onLoad={handleImgLoad}
      />
      <div
        className={`bg-white/50 absolute top-0 left-0 w-full h-full flex justify-center items-center transition duration-500 ${
          !loading ? "opacity-0" : ""
        }`}>
        <ProgressCircular />
      </div>
    </div>
  );
};
