import { create } from "zustand";
import { AuthStore, AuthState } from "../types";

const initialState: AuthState = {
  isLoading: false,
  isGoogleLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  
  setLoading: (isLoading) => set({ isLoading }),
  setGoogleLoading: (isGoogleLoading) => set({ isGoogleLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));