import type { RecentSearchItem } from "@/hooks/recent-searches";
import { RotateCcw } from "react-feather";

type RecentSearchItemCardProps = {
  item: RecentSearchItem;
};

export const RecentSearchItemCard: React.FC<RecentSearchItemCardProps> = (props) => {
  return (
    // <div className="p-2 flex items-center gap-4 hover:bg-white/10">
    <div className="flex h-9 cursor-pointer items-center gap-4 p-1 px-2 transition hover:bg-background_light/20 hover:dark:bg-background_dark/20">
      <RotateCcw size={18} className="stroke-black/40 dark:stroke-white/80" />
      <span className="text-black/80 dark:text-white/80">{props.item.searchTerm}</span>
    </div>
  );
};
