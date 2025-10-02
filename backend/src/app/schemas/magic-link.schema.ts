import { string, object } from "zod";
import { emailSchema } from "@/app/schemas/common";

export const requestMagicLinkSchema = object({
    email: emailSchema,
});

export const verifyMagicLinkSchema = object({
    token: string()
        .min(32, "Invalid token format")
        .max(128, "Invalid token format"),
});
