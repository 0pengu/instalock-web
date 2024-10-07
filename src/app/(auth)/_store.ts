import { create } from "zustand";

type AuthStore = {
  auth: boolean;
  setAuth: (auth: boolean) => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  auth: false,
  setAuth: (auth) => set({ auth }),
}));
