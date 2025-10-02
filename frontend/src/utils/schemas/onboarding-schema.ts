import { object, string, boolean, literal, type infer as zInfer } from "zod";
import {
    emailSchema,
    firstNameSchema,
    lastNameSchema,
    passwordSchema,
} from "@/utils/schemas/common-schemas";
import countries from "@/lib/data/countries.json";

const countryNames = countries.map((country: { name: string }) => country.name);

export const onboardingInitiateSchema = object({
    token: string().trim().uuid("Invalid token format").or(literal("")),
    email: emailSchema,
    password: passwordSchema,
});

// Schema for token verification
export const onboardingVerifyTokenSchema = object({
    email: emailSchema,
    token: string().trim().uuid("Invalid token format"),
});

const onboardingConfirmUserSchema = object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
});

export const onboardingConfirmSchema = object({
    isIndividual: boolean(),
    company: object({
        name: string().optional(),
        slug: string().optional(),
        location: string().optional(),
        country: string().optional(),
        website: string().optional(),
    }).optional(),
    user: onboardingConfirmUserSchema,
})
    .refine(
        (data) => {
            if (!data.isIndividual) {
                // For company registration, validate all company fields
                return (
                    data.company &&
                    data.company.name &&
                    data.company.name.trim().length >= 3 &&
                    data.company.name.trim().length <= 80 &&
                    data.company.slug &&
                    data.company.slug.trim().length >= 3 &&
                    data.company.slug.trim().length <= 63 &&
                    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.company.slug) &&
                    data.company.location &&
                    data.company.location.trim().length >= 2 &&
                    data.company.location.trim().length <= 50 &&
                    data.company.country &&
                    countryNames.includes(data.company.country)
                );
            }
            return true;
        },
        {
            message:
                "All company fields are required when registering as a company",
            path: ["company"],
        }
    )
    .refine(
        (data) => {
            // For individual users, validate user firstName
            if (data.isIndividual) {
                return (
                    data.user.firstName &&
                    data.user.firstName.trim().length >= 2
                );
            }
            // For company users, firstName is auto-populated
            return true;
        },
        {
            message: "First name is required for individual users",
            path: ["user", "firstName"],
        }
    );

export type OnboardingInitiatePayload = zInfer<typeof onboardingInitiateSchema>;
export type OnboardingVerifyPayload = zInfer<
    typeof onboardingVerifyTokenSchema
>;
export type OnboardingConfirmPayload = zInfer<typeof onboardingConfirmSchema>;
