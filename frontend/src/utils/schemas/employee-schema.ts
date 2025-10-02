import { object, string, type infer as zInfer } from "zod";
import {
    emailSchema,
    firstNameSchema,
    lastNameSchema,
    passwordSchema,
} from "@/utils/schemas/common-schemas";

// Schema for inviting an employee
export const inviteEmployeeSchema = object({
    inviteeEmail: emailSchema,
});

// Schema for verifying employee invitation
export const verifyEmployeeInvitationSchema = object({
    inviteeEmail: emailSchema,
    token: string().trim().uuid("Invalid token format"),
});

// Schema for employee registration form
export const employeeRegisterSchema = verifyEmployeeInvitationSchema.extend({
    inviterId: string().trim().uuid("Invalid inviter id format"),
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    password: passwordSchema,
});

// Schema for creating an employee directly
export const createEmployeeSchema = object({
    email: emailSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
});

// Type inference from schemas
export type InviteEmployeePayload = zInfer<typeof inviteEmployeeSchema>;
export type VerifyEmployeeInvitationPayload = zInfer<
    typeof verifyEmployeeInvitationSchema
>;
export type EmployeeRegisterPayload = zInfer<typeof employeeRegisterSchema>;
export type CreateEmployeePayload = zInfer<typeof createEmployeeSchema>;
