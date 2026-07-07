import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { searchIndex } from "../lib/searchIndex";
import type { Show } from "../types/show";

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

type ShowsPage = { shows: Show[]; nextPageToken?: string };

export function useShowSearch(rawQuery: string) {
  const queryClient = useQueryClient();
  const indexSize = useSyncExternalStore(
    (onStoreChange) => searchIndex.subscribe(onStoreChange),
    () => searchIndex.size,
  );

  useEffect(() => {
    const cached = queryClient.getQueryData<InfiniteData<ShowsPage>>(["shows"]);
    if (cached?.pages) {
      searchIndex.addMany(cached.pages.flatMap((page) => page.shows));
    }
  }, [queryClient]);

  const query = useDebouncedValue(rawQuery, 150);

  const suggestions: Show[] = useMemo(
    () => searchIndex.suggest(query, 8),
    [query, indexSize],
  );

  const results: Show[] = useMemo(
    () => searchIndex.search(query),
    [query, indexSize],
  );

  return { query, suggestions, results };
}
