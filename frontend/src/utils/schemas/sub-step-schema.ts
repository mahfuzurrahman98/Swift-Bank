import { object, string, type infer as zInfer } from "zod";

export const createSubStepSchema = object({
    name: string()
        .trim()
        .min(3, "Sub step name must be at least 3 characters long")
        .max(100, "Sub step name must be less than 100 characters"),
    stepId: string().trim().uuid("Invalid step ID format"),
    otherVendorId: string()
        .trim()
        .uuid("Invalid other vendor ID format")
        .optional(),
});

export const updateSubStepSchema = createSubStepSchema.partial();

export type CreateSubStepPayload = zInfer<typeof createSubStepSchema>;
export type UpdateSubStepPayload = zInfer<typeof updateSubStepSchema>;