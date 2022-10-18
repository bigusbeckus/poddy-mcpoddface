import { FC, SyntheticEvent, useState } from "react";
import { ProgressCircular } from "./progress";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export const FetchedImage: FC<ImageProps> = ({ src, alt, className }) => {
  const [loading, setLoading] = useState(true);

  function handleImgLoad(event: SyntheticEvent) {
    setLoading(false);
  }

  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={`object-cover transition duration-500 ${className} ${
          loading ? "opacity-0" : ""
        }`}
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
