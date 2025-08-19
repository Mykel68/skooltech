import { z } from "zod";

// Zod schema for form validation
export const colorSchemeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Theme name is required"),
  primary: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  secondary: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  accent: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  background: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  surface: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  text: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  createdBy: z.string().optional(),
});

export type ColorScheme = z.infer<typeof colorSchemeSchema>;
