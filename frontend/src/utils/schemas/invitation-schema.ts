import { object, string, nativeEnum, array, type infer as zInfer } from "zod";
import { emailSchema } from "@/utils/schemas/common-schemas";
import { UserInitiator } from "@/utils/enums/user";

export const createInvitationSchema = object({
    projectId: string().trim().uuid("Invalid project ID format"),
    inviteeEmails: array(emailSchema)
        .min(1, "At least one email is required")
        .max(5, "You can invite up to 5 clients only")
        .refine((emails) => new Set(emails).size === emails.length, {
            message: "Emails must be unique",
        }),
    message: string()
        .trim()
        .min(5, "Message must be at least 5 characters")
        .max(500, "Message must be less than 500 characters"),
    initiatorType: nativeEnum(UserInitiator, {
        required_error: "Initiator type is required",
        invalid_type_error: "Initiator type must be a valid enum value",
    }),
}).superRefine((data, ctx) => {
    if (
        data.initiatorType === UserInitiator.SUPPLIER &&
        Array.isArray(data.inviteeEmails) &&
        data.inviteeEmails.length !== 1
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["inviteeEmails"],
            message: "Suppliers can only invite one client.",
        });
    }
});

export const acceptInvitationSchema = object({
    acceptMessage: string()
        .trim()
        .min(5, "Message must be at least 5 characters")
        .max(500, "Message must be less than 500 characters"),
});

export const declineInvitationSchema = object({
    declineReason: string()
        .trim()
        .min(5, "Message must be at least 5 characters")
        .max(500, "Message must be less than 500 characters"),
});

export type CreateInvitationPayload = zInfer<typeof createInvitationSchema>;
export type AcceptInvitationPayload = zInfer<typeof acceptInvitationSchema>;
export type DeclineInvitationPayload = zInfer<typeof declineInvitationSchema>;
