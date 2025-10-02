import { object, string, array, type infer as zInfer } from "zod";

export const createStageSchema = object({
    name: string()
        .trim()
        .min(3, "Stage name must be at least 3 characters long")
        .max(100, "Stage name must be less than 100 characters"),
    chatId: string().trim().uuid("Invalid chat ID format"),
});

export const createStagesSchema = object({
    chatId: string().trim().uuid("Invalid chat ID format"),
    stages: array(
        object({
            name: string()
                .trim()
                .min(3, "Stage name must be at least 3 characters long")
                .max(100, "Stage name must be less than 100 characters"),

            steps: array(
                object({
                    name: string()
                        .trim()
                        .min(3, "Step name must be at least 3 characters long")
                        .max(100, "Step name must be less than 100 characters"),
                    subSteps: array(
                        object({
                            name: string()
                                .trim()
                                .min(3, "Sub step name must be at least 3 characters long")
                                .max(100, "Sub step name must be less than 100 characters"),
                        })
                    ).optional(),
                })
            ),
        })
    ),
    otherVendorId: string()
        .trim()
        .uuid("Invalid other vendor ID format")
        .optional(),
});

export const createStageWithAISchema = object({
    chatId: string().trim().uuid("Invalid chat ID format"),
    stageNames: array(string().trim().min(3, "Stage name must be at least 3 characters long").max(100, "Stage name must be less than 100 characters")).min(1, "At least one stage name is required"),
    prompt: string().min(10, "Prompt must be at least 10 characters long"),
    otherVendorId: string().trim().uuid("Invalid other vendor ID format").optional(),
});

export const updateStageSchema = createStageSchema.partial();

export type CreateStagePayload = zInfer<typeof createStageSchema>;
export type CreateStagesPayload = zInfer<typeof createStagesSchema>;
export type UpdateStagePayload = zInfer<typeof updateStageSchema>;
export type CreateStageWithAIPayload = zInfer<typeof createStageWithAISchema>;
