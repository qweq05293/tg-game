import type { DbUserDto } from "@/api/model";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: DbUserDto | null;
  setAuth: (token: string, user: DbUserDto) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}));
