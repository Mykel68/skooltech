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
  school_code: z
    .string()
    .min(3, "School code must be at least 3 characters")
    .max(7, "School code must be at most 7 characters")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "School code can only contain letters, numbers, and dashes"
    )
    .optional(),
  school_image: z
    .union([
      // New file upload
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= 5 * 1024 * 1024,
          "Image must be less than 5MB"
        ),
      // Existing URL
      z.string().url("Must be a valid URL"),
    ])
    .nullable()
    .optional(),
});
