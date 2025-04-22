"use client";

import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";

interface UserState {
  userId: string | null;
  username: string | null;
  role: string | null;
  schoolId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  setUser: (user: {
    userId: string;
    username: string;
    role: string;
    schoolId: string;
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
  clearUser: () => void;
}

// Default state for server-side rendering
const defaultState: UserState = {
  userId: null,
  username: null,
  role: null,
  schoolId: null,
  firstName: null,
  lastName: null,
  email: null,
  setUser: () => {},
  clearUser: () => {},
};

// Persist options with SSR handling
const persistOptions: PersistOptions<UserState> = {
  name: "user-storage",
  storage: createJSONStorage(() => localStorage),
  getStorage: () => {
    // Only use localStorage on the client
    if (typeof window === "undefined") {
      return {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {},
      };
    }
    return localStorage;
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      username: null,
      role: null,
      schoolId: null,
      firstName: null,
      lastName: null,
      email: null,
      setUser: (user) => {
        console.log("[UserStore] Updating user store:", user);
        set({ ...user });
      },
      clearUser: () => {
        console.log("[UserStore] Clearing user store");
        set({ userId: null, username: null, role: null, schoolId: null });
      },
    }),
    persistOptions
  )
);

// Export a function to get initial state for SSR
export function getUserStoreInitialState(): UserState {
  return defaultState;
}
