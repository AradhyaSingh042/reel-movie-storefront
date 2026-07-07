import { useMemo, useState } from 'react';
import { useInfiniteShows } from '../hooks/useInfiniteShows';
import { HeroBanner } from '../components/shows/HeroBanner';
import { ShowGrid } from '../components/shows/ShowGrid';
import { ShowModal } from '../components/shows/ShowModal';
import type { Show } from '../types/show';

export function HomePage() {
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  const {
    shows,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteShows();

  const featuredShow = useMemo(() => {
    const rated = shows.filter((show) => (show.rating ?? 0) >= 8);
    return rated[0] ?? shows[0] ?? null;
  }, [shows]);

  const featuredLoading = isLoading && shows.length === 0;

  return (
    <div>
      <HeroBanner
        show={featuredShow ?? null}
        isLoading={featuredLoading}
        onOpen={setSelectedShow}
      />

      <h2 className="mb-4 font-display text-2xl tracking-wide text-muted">
        FULL CATALOGUE
      </h2>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-surface" />
          ))}
        </div>
      )}

      {isError && (
        <p className="font-mono text-sm text-danger">
          Couldn't reach the show catalogue. If you're offline, cached shows (if
          any) will still show up here once loaded before.
        </p>
      )}

      {!isLoading && !isError && (
        <ShowGrid
          shows={shows}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onFetchNextPage={fetchNextPage}
          onOpenShow={setSelectedShow}
        />
      )}

      <ShowModal show={selectedShow} onClose={() => setSelectedShow(null)} />
    </div>
  );
}
