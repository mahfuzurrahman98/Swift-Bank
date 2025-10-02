import { infer as zInfer } from "zod";
import {
    requestMagicLinkSchema,
    verifyMagicLinkSchema,
} from "@/app/schemas/magic-link.schema";

export interface RequestMagicLinkDto
    extends zInfer<typeof requestMagicLinkSchema> {}

export interface VerifyMagicLinkDto
    extends zInfer<typeof verifyMagicLinkSchema> {}
