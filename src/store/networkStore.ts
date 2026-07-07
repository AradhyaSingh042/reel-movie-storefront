import { create } from 'zustand';

interface NetworkState {
  isOnline: boolean;
  source: 'real' | 'simulated';
  setStatus: (isOnline: boolean, source: 'real' | 'simulated') => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isOnline: navigator.onLine,
  source: 'real',
  setStatus: (isOnline, source) => set({ isOnline, source }),
}));
