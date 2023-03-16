import Link from "next/link";
import { FetchedImage } from "@/components/image";

type PodcastThumbProps = {
  id: number;
  artworkUrl: string;
  name: string;
};

export const PodcastThumb: React.FC<PodcastThumbProps> = ({ id, artworkUrl, name }) => {
  return (
    <Link
      href={{
        pathname: `/podcast/${id}`,
      }}
    >
      <div
        key={id}
        // onClick={() => handleItemClick(result)}
        className="cursor-pointer rounded-md p-1 transition duration-100 hover:bg-background_light/20 hover:dark:bg-background_dark/20"
      >
        {/* <img src={result.artworkUrl600} className="w-full rounded-md aspect-square object-cover" /> */}
        <FetchedImage
          src={artworkUrl}
          alt={`${name} artwork`}
          imgClassName="w-full rounded-md aspect-square overflow-hidden"
        />
        <div className="mt-2 text-ellipsis text-center leading-tight line-clamp-1">{name}</div>
      </div>
    </Link>
  );
};
