import { z } from "zod";

export const messageSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters"),
    content: z.string().optional(),
    contentFile: z.any().optional(),
    type: z.enum(["announcement", "message", "urgent", "newsletter"]),
    recipientSelections: z.record(z.string().optional()).optional(),
    attachment: z.any().optional(),
    recipients: z.array(z.string().optional()),
    contentMode: z.enum(["write", "upload"]).optional(), // 👈 Add this line
  })
  .refine((data) => !!data.content || !!data.contentFile, {
    message: "Please write content or upload a file.",
    path: ["content"],
  })
  .transform((data) => ({
    ...data,
    recipients: Object.values(data.recipientSelections || {}).filter(Boolean),
  }))
  .refine((data) => data.recipients.length > 0, {
    message: "At least one recipient is required",
    path: ["recipients"],
  });

export type MessageFormData = z.infer<typeof messageSchema>;
