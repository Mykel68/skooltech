import { ColorScheme } from "@/schema/themeSchema";

export const presetThemes: ColorScheme[] = [
  {
    id: "default",
    name: "Default Blue",
    primary: "#3B82F6",
    secondary: "#1E40AF",
    accent: "#06B6D4",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    text: "#1E293B",
  },
  {
    id: "dark",
    name: "Dark Mode",
    primary: "#0EA5E9",
    secondary: "#0369A1",
    accent: "#22D3EE",
    background: "#0F172A",
    surface: "#1E293B",
    text: "#F8FAFC",
  },
  {
    id: "forest",
    name: "Forest",
    primary: "#15803D",
    secondary: "#14532D",
    accent: "#4ADE80",
    background: "#ECFDF5",
    surface: "#D1FAE5",
    text: "#064E3B",
  },
];
