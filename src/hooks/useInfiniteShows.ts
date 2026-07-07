import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTitlesPage } from '../lib/imdbapi';
import { searchIndex } from '../lib/searchIndex';
import { useNetworkStore } from '../store/networkStore';

const SHOWS_PER_PAGE = 50; 
const TARGET_SHOW_COUNT = 10_000; 
const MAX_PAGES = Math.ceil(TARGET_SHOW_COUNT / SHOWS_PER_PAGE);

export function useInfiniteShows() {
  const isOnline = useNetworkStore((s) => s.isOnline);

  const query = useInfiniteQuery({
    queryKey: ['shows'],
    queryFn: ({ pageParam }) => fetchTitlesPage(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.nextPageToken) return undefined; 
      if (allPages.length >= MAX_PAGES) return undefined; 
      return lastPage.nextPageToken;
    },
    networkMode: isOnline ? 'online' : 'offlineFirst',
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
  useEffect(() => {
    const pages = query.data?.pages ?? [];
    searchIndex.addMany(pages.flatMap((page) => page.shows));
  }, [query.data?.pages]);

  const shows = query.data?.pages.flatMap((p) => p.shows) ?? [];

  return {
    shows,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
