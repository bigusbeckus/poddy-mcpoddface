import Link from "next/link";
import { FetchedImage } from "./image";

type PodcastThumbProps = {
  id: number;
  artworkUrl: string;
  name: string;
};

export const PodcastThumb: React.FC<PodcastThumbProps> = ({
  id,
  artworkUrl,
  name,
}) => {
  return (
    <Link
      href={{
        pathname: `/podcast/${id}`,
      }}>
      <div
        key={id}
        // onClick={() => handleItemClick(result)}
        className="hover:bg-background_light/20 hover:dark:bg-background_dark/20 p-1 cursor-pointer rounded-md transition duration-300">
        {/* <img src={result.artworkUrl600} className="w-full rounded-md aspect-square object-cover" /> */}
        <FetchedImage
          src={artworkUrl}
          alt={`${name} artwork`}
          className="w-full rounded-md aspect-square overflow-hidden"
        />
        <div className="mt-2 leading-tight text-center text-ellipsis">
          {name}
        </div>
      </div>
    </Link>
  );
};
