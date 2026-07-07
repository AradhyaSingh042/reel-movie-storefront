import type { Show } from "../types/show";

export class ShowSearchIndex {
  private byId = new Map<string, Show>();
  private byYear = new Map<number, Set<string>>();
  private prefixMap = new Map<string, Set<string>>();
  private listeners = new Set<() => void>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  addMany(shows: Show[]) {
    let changed = false;
    for (const show of shows) {
      if (this.add(show)) changed = true;
    }
    if (changed) this.listeners.forEach((listener) => listener());
  }

  add(show: Show): boolean {
    if (this.byId.has(show.id)) return false;
    this.byId.set(show.id, show);

    if (show.premiereYear) {
      const bucket = this.byYear.get(show.premiereYear) ?? new Set<string>();
      bucket.add(show.id);
      this.byYear.set(show.premiereYear, bucket);
    }

    const name = show.name.toLowerCase();
    const maxPrefixLen = Math.min(name.length, 4);
    for (let len = 1; len <= maxPrefixLen; len++) {
      const prefix = name.slice(0, len);
      const bucket = this.prefixMap.get(prefix) ?? new Set<string>();
      bucket.add(show.id);
      this.prefixMap.set(prefix, bucket);
    }

    return true;
  }

  get size() {
    return this.byId.size;
  }

  getById(id: string): Show | undefined {
    return this.byId.get(id);
  }

  suggest(query: string, limit = 8): Show[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    if (/^\d{4}$/.test(trimmed)) {
      const ids = this.byYear.get(Number(trimmed));
      if (ids) return [...ids].slice(0, limit).map((id) => this.byId.get(id)!);
    }

    const key = trimmed.slice(0, 4);
    const idBucket = this.prefixMap.get(key);
    if (!idBucket) return [];

    const results: Show[] = [];
    for (const id of idBucket) {
      const show = this.byId.get(id);
      if (show && show.name.toLowerCase().startsWith(trimmed)) {
        results.push(show);
        if (results.length >= limit) break;
      }
    }
    return results;
  }
  search(query: string): Show[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    if (/^\d{4}$/.test(trimmed)) {
      const ids = this.byYear.get(Number(trimmed)) ?? new Set<string>();
      return [...ids].map((id) => this.byId.get(id)!);
    }

    if (/^tt\d+$/.test(trimmed)) {
      const byIdMatch = this.byId.get(trimmed);
      if (byIdMatch) return [byIdMatch];
    }

    return [...this.byId.values()].filter((show) =>
      show.name.toLowerCase().includes(trimmed),
    );
  }
}

export const searchIndex = new ShowSearchIndex();
