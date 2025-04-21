import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and policy",
  }),
});
