import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Show } from '../types/show';

interface LibraryState {
  watchlist: Show[];
  history: Show[];
  addToWatchlist: (show: Show) => void;
  removeFromWatchlist: (showId: string) => void;
  isInWatchlist: (showId: string) => boolean;
  markAsWatched: (show: Show) => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      history: [],

      addToWatchlist: (show) => {
        if (get().watchlist.some((s) => s.id === show.id)) return;
        set((state) => ({ watchlist: [show, ...state.watchlist] }));
      },

      removeFromWatchlist: (showId) => {
        set((state) => ({
          watchlist: state.watchlist.filter((s) => s.id !== showId),
        }));
      },

      isInWatchlist: (showId) => get().watchlist.some((s) => s.id === showId),

      markAsWatched: (show) => {
        set((state) => ({
          history: [show, ...state.history.filter((s) => s.id !== show.id)].slice(
            0,
            50,
          ),
        }));
      },
    }),
    { name: 'reel-library' },
  ),
);
