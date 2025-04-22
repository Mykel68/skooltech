import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  userId: string | null;
  username: string | null;
  role: string | null;
  schoolId: string | null;
  setUser: (user: {
    userId: string;
    username: string;
    role: string;
    schoolId: string;
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
      setUser: (user) => {
        console.log("Updating user store:", user); // Debug log
        set({ ...user });
      },
      clearUser: () => {
        console.log("Clearing user store"); // Debug log
        set({ userId: null, username: null, role: null, schoolId: null });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
