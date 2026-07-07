export interface Show {
  id: string;
  name: string;
  premiereYear: number | null;
  rating: number | null;
  genres: string[];
  summary: string;
  image: string | null;
  status: string;
}

export interface ImdbApiTitleRaw {
  id: string;
  type?: string;
  primaryTitle: string;
  originalTitle?: string;
  primaryImage?: { url: string; width?: number; height?: number } | null;
  startYear?: number | null;
  endYear?: number | null;
  genres?: string[];
  rating?: {
    aggregateRating?: number | null;
    voteCount?: number | null;
  } | null;
  plot?: string | null;
}

export interface ImdbApiTitlesResponse {
  titles: ImdbApiTitleRaw[];
  nextPageToken?: string;
  totalCount?: number;
}
