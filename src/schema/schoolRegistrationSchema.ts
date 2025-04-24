import { z } from "zod";

export const schoolRegistrationFormSchema = z.object({
  name: z.string().min(2, "School name must be at least 2 characters"),
  admin_username: z.string().min(3, "Username must be at least 3 characters"),
  admin_password: z.string().min(8, "Password must be at least 8 characters"),
  admin_email: z.string().email("Invalid email address"),
  admin_first_name: z
    .string()
    .min(2, "First name must be at least 2 characters"),
  admin_last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().min(10, "Invalid phone number").optional(),
  school_image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB"
    ),
});

export const schoolRegistrationApiSchema = z.object({
  name: z.string().min(2),
  admin_username: z.string().min(3),
  admin_password: z.string().min(8),
  admin_email: z.string().email(),
  admin_first_name: z.string().min(2),
  admin_last_name: z.string().min(2),
  phone_number: z.string().min(10).optional(),
  school_image: z.string().url().nullable().optional(),
});
