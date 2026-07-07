import type {
  Show,
  ImdbApiTitleRaw,
  ImdbApiTitlesResponse,
} from "../types/show";

const BASE_URL = "https://api.imdbapi.dev";
const PAGE_SIZE = 50;
const MAX_RETRIES = 4;

const FALLBACK_POSTER =
  "https://placehold.co/300x450/141822/8A8F9C?text=No+Poster";

function isRateLimitedError(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false;
  const payload = data as { code?: number; message?: string };
  return payload.code === 13 || payload.message?.includes("429") === true;
}

async function fetchJson<T>(url: string): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      const data: unknown = await res.json();

      if (isRateLimitedError(data)) {
        lastError = new Error(
          typeof (data as { message?: string }).message === "string"
            ? (data as { message: string }).message
            : "Rate limited by API",
        );
        if (attempt < MAX_RETRIES - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, 600 * 2 ** attempt),
          );
          continue;
        }
        throw lastError;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      return data as T;
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("Failed to fetch data");
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, 600 * 2 ** attempt));
        continue;
      }
    }
  }

  throw lastError ?? new Error("Failed to fetch data");
}

function mapTitle(raw: ImdbApiTitleRaw): Show {
  const isSeries = raw.type === "tvSeries" || raw.type === "tvMiniSeries";
  let status = "Movie";
  if (isSeries) {
    status = raw.endYear ? "Ended" : "Running";
  }

  return {
    id: raw.id,
    name: raw.primaryTitle ?? raw.originalTitle ?? "Untitled",
    premiereYear: raw.startYear ?? null,
    rating: raw.rating?.aggregateRating ?? null,
    genres: raw.genres ?? [],
    summary: raw.plot ?? "",
    image: raw.primaryImage?.url ?? FALLBACK_POSTER,
    status,
  };
}

export async function fetchTitlesPage(
  pageToken?: string,
): Promise<{ shows: Show[]; nextPageToken?: string }> {
  const params = new URLSearchParams();
  params.append("types", "TV_SERIES");
  params.append("types", "MOVIE");
  params.set("pageSize", String(PAGE_SIZE));
  if (pageToken) params.set("pageToken", pageToken);

  const res = await fetchJson<ImdbApiTitlesResponse>(
    `${BASE_URL}/titles?${params.toString()}`,
  );
  return {
    shows: (res.titles ?? []).map(mapTitle),
    nextPageToken: res.nextPageToken || undefined,
  };
}

export async function fetchTitleById(id: string): Promise<Show> {
  const data = await fetchJson<ImdbApiTitleRaw>(`${BASE_URL}/titles/${id}`);
  return mapTitle(data);
}

export async function fetchFeaturedShow(): Promise<Show> {
  const { shows } = await fetchTitlesPage();
  const rated = shows.filter((s) => (s.rating ?? 0) >= 8);
  return rated[0] ?? shows[0];
}
