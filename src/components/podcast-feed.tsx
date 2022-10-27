import { useQuery } from "@tanstack/react-query";
import { podcastFeedLink } from "../libs/itunes-podcast";
import { PodcastThumb } from "./podcast-thumb";

export const PodcastFeed: React.FC = () => {
  const feedLink = podcastFeedLink();
  const { data, isLoading, error } = useQuery(
    ["podcasts", "feed", "top"],
    feedLink.fetch
  );

  if (isLoading) {
    return <div>Loading top feed...</div>;
  }

  if (error || !data) {
    return (
      <div>{`Error: ${
        error && error instanceof Error ? error.message : "Unable to load feed"
      }`}</div>
    );
  }

  return (
    <div>
      {data.results.map((result) => (
        <PodcastThumb
          key={result.id}
          id={result.id}
          artworkUrl={result.artworkUrl100}
          name={result.name}
        />
      ))}
    </div>
  );
};
