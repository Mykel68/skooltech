import { z } from "zod";
import { schoolProfileSchema } from "@/schema/schoolProfileSchema";

export type SchoolProfileFormData = z.infer<typeof schoolProfileSchema>;
