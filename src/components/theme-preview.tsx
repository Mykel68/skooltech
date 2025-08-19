import { ColorScheme } from "@/schema/themeSchema";
import React from "react";

export default function ThemePreview({ theme }: { theme: ColorScheme }) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="rounded-lg p-4 shadow-lg"
        style={{ backgroundColor: theme.background, color: theme.text }}
      >
        <div
          className="h-8 rounded-md mb-3"
          style={{ backgroundColor: theme.primary }}
        />
        <div
          className="h-12 rounded-md mb-3 p-2"
          style={{ backgroundColor: theme.surface }}
        >
          <div
            className="h-4 rounded w-3/4 mb-1"
            style={{ backgroundColor: theme.secondary }}
          />
          <div
            className="h-3 rounded w-1/2"
            style={{ backgroundColor: theme.accent }}
          />
        </div>
        <div className="flex space-x-2">
          <div
            className="flex-1 h-6 rounded"
            style={{ backgroundColor: theme.accent }}
          />
          <div
            className="w-16 h-6 rounded"
            style={{ backgroundColor: theme.primary }}
          />
        </div>
      </div>
    </div>
  );
}
