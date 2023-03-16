import type { Prisma } from "@prisma/client";

export const EPISODE_DEFAULT_ORDER_BY: Prisma.Enumerable<Prisma.EpisodeOrderByWithRelationInput> = [
  { pubDate: "desc" },
  { itunesSeason: "desc" },
  { itunesEpisode: "desc" },
];
