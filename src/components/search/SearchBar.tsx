import { useState } from 'react';
import type { Show } from '../../types/show';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: Show[];
  onSelectSuggestion: (show: Show) => void;
}

export function SearchBar({ value, onChange, suggestions, onSelectSuggestion }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full max-w-xl">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)} // let click land first
        placeholder="Search by name, id, or release year..."
        className="w-full rounded-md border border-line bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-marquee"
      />
      {focused && value && suggestions.length > 0 && (
        <ul className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-line bg-surfaceRaised shadow-lg">
          {suggestions.map((show) => (
            <li key={show.id}>
              <button
                onClick={() => onSelectSuggestion(show)}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-surface"
              >
                <span>{show.name}</span>
                <span className="font-mono text-xs text-muted">
                  {show.premiereYear ?? '—'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
