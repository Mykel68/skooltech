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
  role: string | null;
  schoolId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  schoolName: string | null;
  schoolImage: string | null;
  schoolCode: string | null;
  is_school_active: boolean | null;
  setUser: (user: {
    userId: string;
    username: string;
    role: string;
    schoolId: string;
    firstName: string;
    lastName: string;
    email: string;
    schoolName: string;
    schoolImage: string;
    schoolCode: string;
    is_school_active: boolean;
  }) => void;
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
        });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
