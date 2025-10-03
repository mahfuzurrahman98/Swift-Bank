import { object, type infer as zInfer } from "zod";
import { emailSchema } from "@/utils/schemas/common-schemas";

export const magicLinkSchema = object({
    email: emailSchema,
});

export type MagicLinkPayload = zInfer<typeof magicLinkSchema>;
