import { literal, object, string, type infer as zInfer } from "zod";
import { emailSchema } from "@/utils/schemas/common-schemas";

// Schema for inviting a contractor
export const inviteContractorSchema = object({
    inviteeEmail: emailSchema,
    message: string()
        .trim()
        .max(500, "Message must be less than 500 characters")
        .or(literal("")),
});

// Schema for contractor registration form (for existing INDIVIDUAL users)
export const acceptContractorInvitationSchema = object({
    acceptMessage: string()
        .min(5, "Decline reason must be at least 5 characters long")
        .max(500, "Decline reason must be less than 500 characters"),
});

// Schema for declining contractor invitation
export const declineContractorInvitationSchema = object({
    declineReason: string()
        .min(5, "Decline reason must be at least 5 characters long")
        .max(500, "Decline reason must be less than 500 characters"),
});

// Type inference from schemas
export type InviteContractorPayload = zInfer<typeof inviteContractorSchema>;
export type AcceptContractorInvitationPayload = zInfer<
    typeof acceptContractorInvitationSchema
>;
export type DeclineContractorInvitationPayload = zInfer<
    typeof declineContractorInvitationSchema
>;
