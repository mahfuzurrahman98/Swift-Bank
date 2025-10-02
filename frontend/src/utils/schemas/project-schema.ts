import { object, string, type infer as zInfer } from "zod";

export const createProjectSchema = object({
    name: string()
        .trim()
        .min(5, "Project name must be at least 5 characters")
        .max(100, "Project name must be less than 100 characters"),
});

export type CreateProjectPayload = zInfer<typeof createProjectSchema>;
