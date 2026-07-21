import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description is too short"),
  thumbnail: z.string().url("Must be a valid image URL"),
  images: z.array(z.string().url()).optional(),
  techStack: z.string().min(1, "Enter at least one technology"), // We'll split this by comma in the UI
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().min(2, "Category is required"),
  featured: z.boolean(),
  status: z.enum(["completed", "in-progress"]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;