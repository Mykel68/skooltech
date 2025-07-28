import { z } from "zod";
import { profileSchema } from "@/schema/profileSchema";

export type ProfileFormData = z.infer<typeof profileSchema>;
