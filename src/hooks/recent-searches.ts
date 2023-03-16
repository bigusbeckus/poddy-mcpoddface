import { useEffect, useState } from "react";

const RECENT_SEARCHES_KEY = "recent-searches";
const RECENT_SEARCH_ITEMS_COUNT = 10;

export type RecentSearchItem = {
  id: number;
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
    // const existingIds = recentSearches.map((item) => item.id);
    const existingIds: number[] = [];
    const existingNames: string[] = [];
    recentSearches.forEach((item) => {
      existingIds.push(item.id);
      existingNames.push(item.searchTerm.toLowerCase());
    });

    if (existingNames.includes(searchTerm.toLowerCase())) {
      return;
    }

    let id = 0;
    do {
      id = Math.floor(Math.random() * RECENT_SEARCH_ITEMS_COUNT);
    } while (existingIds.includes(id));

    const searchItem = {
      id,
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
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedRecentSearches));
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
