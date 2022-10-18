import { useQuery } from "@tanstack/react-query";
// import { GetServerSideProps } from "next";
import { getFeed, PodcastResult } from "../libs/itunes-podcast";

type PodcastDetailsProps = {
  podcast: PodcastResult;
};

// export const getServerSideProps: GetServerSideProps = async ({params}) {
//   if (!(params && params.podcast)) {
//     return {
//       error: true
//     }
//   }
//   const {collectionId, feedUrl} = params.podcast as PodcastResult;

// }

export const PodcastDetails: React.FC<PodcastDetailsProps> = ({ podcast }) => {
  const { data, isLoading, error } = useQuery(
    ["podcast", podcast.collectionId, "feed"],
    () => getFeed(podcast.feedUrl)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error:{" "}
        {error instanceof Error
          ? error.message
          : `Lookup failed on collectionId: ${podcast.collectionId}`}
      </div>
    );
  }

  return <div>{JSON.stringify(data)}</div>;
};
