import { useState } from "react";
import { useShowSearch } from "../hooks/useShowSearch";
import { SearchBar } from "../components/search/SearchBar";
import { SearchResults } from "../components/search/SearchResults";
import { ShowModal } from "../components/shows/ShowModal";
import type { Show } from "../types/show";

export function SearchPage() {
  const [rawQuery, setRawQuery] = useState("");
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const { query, suggestions, results } = useShowSearch(rawQuery);

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl tracking-wide">Search</h1>
      <p className="mb-6 text-sm text-muted">
      </p>

      <SearchBar
        value={rawQuery}
        onChange={setRawQuery}
        suggestions={suggestions}
        onSelectSuggestion={(show) => {
          setRawQuery(show.name);
          setSelectedShow(show);
        }}
      />

      <SearchResults
        query={query}
        results={results}
        onOpenShow={setSelectedShow}
      />

      <ShowModal show={selectedShow} onClose={() => setSelectedShow(null)} />
    </div>
  );
}
