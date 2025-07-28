import { z } from "zod";
import { schoolRegistrationFormSchema } from "@/schema/schoolRegistrationSchema";

export type SchoolFormData = z.infer<typeof schoolRegistrationFormSchema>;
