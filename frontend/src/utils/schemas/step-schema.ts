import { object, string, type infer as zInfer } from "zod";

export const createStepSchema = object({
    name: string()
        .trim()
        .min(3, "Step name must be at least 3 characters long")
        .max(100, "Step name must be less than 100 characters"),
    stageId: string().trim().uuid("Invalid stage ID format"),
});

export const updateStepSchema = createStepSchema.partial();

export type CreateStepPayload = zInfer<typeof createStepSchema>;
export type UpdateStepPayload = zInfer<typeof updateStepSchema>;
