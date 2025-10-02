import { object, string, type infer as zInfer } from "zod";
import { emailSchema, passwordSchema } from "@/utils/schemas/common-schemas";

export const signinSchema = object({
    email: emailSchema,
    password: passwordSchema,
});

export const resetPasswordSchema = object({
    oldPassword: string().trim().min(1, "Current password is required"),
    newPassword: passwordSchema,
});

export const forgotPasswordSchema = object({
    email: emailSchema,
});

export const verifyOTPSchema = object({
    email: emailSchema,
    otp: string()
        .trim()
        .length(5, "OTP must be exactly 5 digits")
        .regex(/^\d{5}$/, "OTP must contain only numbers"),
});

export const updatePasswordSchema = object({
    email: emailSchema,
    otp: string()
        .trim()
        .length(5, "OTP must be exactly 5 digits")
        .regex(/^\d{5}$/, "OTP must contain only numbers"),
    token: string().trim().min(1, "Token is required"),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const magicLinkSchema = object({
    email: emailSchema,
});

export type SigninPayload = zInfer<typeof signinSchema>;
export type ResetPasswordPayload = zInfer<typeof resetPasswordSchema>;
export type ForgotPasswordPayload = zInfer<typeof forgotPasswordSchema>;
export type VerifyOTPPayload = zInfer<typeof verifyOTPSchema>;
export type UpdatePasswordPayload = zInfer<typeof updatePasswordSchema>;
export type MagicLinkPayload = zInfer<typeof magicLinkSchema>;
