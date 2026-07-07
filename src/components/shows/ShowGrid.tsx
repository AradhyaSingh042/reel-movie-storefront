import { useEffect, useRef } from 'react';
import type { Show } from '../../types/show';
import { ShowCard } from './ShowCard';
import { Spinner } from '../ui/Spinner';

interface ShowGridProps {
  shows: Show[];
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
  onOpenShow: (show: Show) => void;
}

export function ShowGrid({
  shows,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  onOpenShow,
}: ShowGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onFetchNextPage();
        }
      },
      { rootMargin: '400px' }, // start loading a bit before the sentinel is visible
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} onOpen={onOpenShow} />
        ))}
      </div>
      <div ref={sentinelRef} className="flex justify-center py-8">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && shows.length > 0 && (
          <p className="font-mono text-xs text-muted">
            That's the full catalogue — {shows.length.toLocaleString()} shows loaded.
          </p>
        )}
      </div>
    </div>
  );
}
