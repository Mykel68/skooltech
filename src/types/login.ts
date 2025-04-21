import { z } from "zod";
import { loginSchema } from "@/schema/loginSchema";

export type LoginFormData = z.infer<typeof loginSchema>;
