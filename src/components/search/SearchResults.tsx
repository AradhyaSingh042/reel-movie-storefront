import type { Show } from "../../types/show";
import { ShowCard } from "../shows/ShowCard";

interface SearchResultsProps {
  query: string;
  results: Show[];
  onOpenShow: (show: Show) => void;
}

export function SearchResults({
  query,
  results,
  onOpenShow,
}: SearchResultsProps) {
  if (!query) {
    return (
      <p className="mt-6 font-mono text-sm text-muted">
        Start typing to search the catalogue by title, id, or release year.
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <p className="mt-6 font-mono text-sm text-muted">
        No shows match "{query}" in what's loaded so far — try scrolling the
        home feed a bit further to index more titles.
      </p>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {results.map((show) => (
        <ShowCard key={show.id} show={show} onOpen={onOpenShow} />
      ))}
    </div>
  );
}
