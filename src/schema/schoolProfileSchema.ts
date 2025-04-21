import { z } from "zod";

export const schoolProfileSchema = z.object({
  name: z
    .string()
    .min(2, "School name must be at least 2 characters")
    .optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .optional(),
  phone_number: z.string().min(10, "Invalid phone number").optional(),
  school_image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB"
    ),
  school_code: z
    .string()
    .min(3)
    .max(7)
    .regex(/^[a-zA-Z0-9-]+$/)
    .optional(),
});
