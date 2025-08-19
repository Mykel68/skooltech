import { ColorScheme } from "@/schema/themeSchema";

export const mockAPI = {
  saveThemeToSchool: async (theme: ColorScheme) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Theme saved to school:", theme);
        resolve({ success: true });
      }, 1000);
    });
  },

  getSchoolThemes: async (): Promise<
    (ColorScheme & { id: string; createdBy: string })[]
  > => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "school-blue",
            name: "School Blue",
            primary: "#1E3A8A",
            secondary: "#1E40AF",
            accent: "#3B82F6",
            background: "#FFFFFF",
            surface: "#EFF6FF",
            text: "#1E3A8A",
            createdBy: "Admin",
          },
        ]);
      }, 500);
    });
  },
};
