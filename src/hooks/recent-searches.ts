import { useEffect, useState } from "react";

const RECENT_SEARCHES_KEY = "recent_searches";
const RECENT_SEARCH_ITEMS_COUNT = 10;

type RecentSearchItem = {
  searchTerm: string;
  searchedAt: number;
};

function loadRecentSearches() {
  try {
    const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (storedSearches) {
      return JSON.parse(storedSearches) as RecentSearchItem[];
    } else {
      return [] as RecentSearchItem[];
    }
  } catch (e) {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    return [] as RecentSearchItem[];
  }
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  useEffect(() => {
    setRecentSearches(loadRecentSearches());
  }, []);

  const addToRecentSearches = (searchTerm: string) => {
    const searchItem = {
      searchTerm,
      searchedAt: Date.now(),
    };
    const updatedRecentSearches = [
      searchItem,
      ...recentSearches.slice(
        0,
        recentSearches.length >= RECENT_SEARCH_ITEMS_COUNT
          ? RECENT_SEARCH_ITEMS_COUNT - 1
          : undefined
      ),
    ]; // Ensure a maximum of `RECENT_SEARCH_ITEMS_COUNT` items are kept
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(updatedRecentSearches)
    );
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  return {
    recentSearches,
    addToRecentSearches,
    clearRecentSearches,
  };
}
