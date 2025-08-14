"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const safeStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(name);
    }
  },
};

interface UserState {
  userId: string | null;
  username: string | null;
  role: string | string[] | null; // <-- updated
  schoolId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  schoolName: string | null;
  schoolImage: string | null;
  schoolCode: string | null;
  is_school_active: boolean | null;
  session_id: string | null;
  term_id: string | null;
  role_ids: number[] | null;
  role_names: string[] | string | null;

  setUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
}

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
      schoolName: null,
      schoolImage: null,
      schoolCode: null,
      is_school_active: null,
      session_id: null,
      term_id: null,
      role_ids: null,
      role_names: null,
      setUser: (user) => {
        console.log("[UserStore] Updating user store:", user);
        set({ ...user });
      },
      clearUser: () => {
        console.log("[UserStore] Clearing user store");
        set({
          userId: null,
          username: null,
          role: null,
          schoolId: null,
          firstName: null,
          lastName: null,
          email: null,
          schoolName: null,
          schoolImage: null,
          schoolCode: null,
          is_school_active: null,
          session_id: null,
          term_id: null,
          role_ids: null,
          role_names: null,
        });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
