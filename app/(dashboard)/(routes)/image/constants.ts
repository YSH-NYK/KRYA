import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  seed: z.string().optional(),
  guidanceScale: z.string().optional()
});
