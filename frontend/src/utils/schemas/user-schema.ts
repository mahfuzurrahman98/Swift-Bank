import { literal, object, string, type infer as zInfer } from "zod";
import {
    firstNameSchema,
    lastNameSchema,
    validUrlSchema,
} from "@/utils/schemas/common-schemas";
import { timeZones } from "@/lib/data/timezones";
import countries from "@/lib/data/countries.json";

const timezoneValues = timeZones.map((tz) => tz.value);
const countryNames = countries.map((country: { name: string }) => country.name);

export const baseSchema = object({
    // Basic Info
    firstName: firstNameSchema,
    lastName: lastNameSchema,

    // Contact
    phone: string()
        .trim()
        .min(10, "Phone number must be at least 10 digits")
        .max(20, "Phone number must be less than 20 digits")
        .optional(),

    // Settings
    settings: object({
        timezone: string()
            .trim()
            .refine((val) => timezoneValues.includes(val), {
                message: "Please select a valid timezone",
            })
            .or(literal(""))
            .optional(),
    }),
});

export const userProfileSettingsSchema = baseSchema.extend({
    designation: string()
        .trim()
        .min(2, "Designation must be at least 2 characters")
        .max(50, "Designation must be less than 50 characters")
        .or(literal(""))
        .optional(),
});

export const vendorProfileSettingsSchema = baseSchema.extend({
    location: string()
        .trim()
        .min(2, "Location must be at least 2 characters")
        .max(100, "Location must be less than 100 characters"),
    country: string()
        .trim()
        .refine((val) => countryNames.includes(val), {
            message: "Please select a valid country from the list",
        }),
    website: validUrlSchema.or(literal("")).optional(),
});

export type UserProfileSettingsPayload = zInfer<
    typeof userProfileSettingsSchema
>;
export type VendorProfileSettingsPayload = zInfer<
    typeof vendorProfileSettingsSchema
>;
