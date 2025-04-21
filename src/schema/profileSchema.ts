import { z } from "zod";

export const profileSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .optional(),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  email: z.string().email("Please enter a valid email address").optional(),
});
