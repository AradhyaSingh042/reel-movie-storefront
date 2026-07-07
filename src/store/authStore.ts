import { create } from 'zustand';
import type { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  authChecked: boolean; 
  setUser: (user: User | null) => void;
  setAuthChecked: (checked: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authChecked: false,
  setUser: (user) => set({ user }),
  setAuthChecked: (authChecked) => set({ authChecked }),
}));
