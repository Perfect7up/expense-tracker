import { create } from "zustand";
import { SigninStore, SigninState } from "../types";

const initialState: SigninState = {
  isLoading: false,
  isGoogleLoading: false,
  error: null,
};

export const useSigninStore = create<SigninStore>((set) => ({
  ...initialState,
  
  setLoading: (isLoading) => set({ isLoading }),
  setGoogleLoading: (isGoogleLoading) => set({ isGoogleLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));