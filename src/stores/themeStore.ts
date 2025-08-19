import { ColorScheme } from "@/schema/themeSchema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  currentTheme: string;
  customThemes: (ColorScheme & { id: string })[];
  previewTheme: ColorScheme | null;

  setCurrentTheme: (themeId: string) => void;
  setPreviewTheme: (theme: ColorScheme) => void;
  clearPreview: () => void;
  addCustomTheme: (theme: ColorScheme) => void;
  removeCustomTheme: (themeId: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: "default",
      customThemes: [],
      previewTheme: null,

      setCurrentTheme: (themeId) => set({ currentTheme: themeId }),
      setPreviewTheme: (theme) => set({ previewTheme: theme }),
      clearPreview: () => set({ previewTheme: null }),

      addCustomTheme: (theme) =>
        set((state) => ({
          customThemes: [
            ...state.customThemes,
            { ...theme, id: Date.now().toString() },
          ],
        })),

      removeCustomTheme: (themeId) =>
        set((state) => ({
          customThemes: state.customThemes.filter((t) => t.id !== themeId),
        })),
    }),
    {
      name: "theme-settings",
    }
  )
);
