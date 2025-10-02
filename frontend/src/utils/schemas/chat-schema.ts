import { object, string, type infer as zInfer, nativeEnum } from "zod";
import { ChatType } from "@/utils/enums/chat";

export const createChatSchema = object({
    title: string()
        .trim()
        .min(5, "Chat title must be at least 5 characters")
        .max(100, "Chat title must be less than 100 characters"),
    projectId: string().trim().uuid("Invalid project ID format"),
    type: nativeEnum(ChatType, {
        required_error: "Chat type is required",
        invalid_type_error: "Invalid chat type",
    }),
});

export type CreateChatPayload = zInfer<typeof createChatSchema>;
