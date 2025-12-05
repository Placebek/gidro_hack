// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "guest" | "expert";

type User = {
  role: Role;
};

type AuthStore = {
  user: User | null;
  setRole: (role: Role) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setRole: (role) =>
        set({
          user: { role },
        }),
      logout: () => set({ user: null }),
    }),
    {
      name: "gidroatlas-auth", // ключ в localStorage
    }
  )
);