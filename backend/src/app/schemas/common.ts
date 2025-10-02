import { number, object, string } from "zod";

// Email schema
export const emailSchema = string().trim().email("Please enter a valid email");

// Password schema
export const passwordSchema = string();
// .min(8, "Password must be at least 8 characters")
// .max(20, "Password must be less than 50 characters")
// .regex(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/,
//     "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
// );

// Valid URL schema
export const validUrlSchema = string()
    .trim()
    .url("Link must be a valid URL")
    .startsWith("https://", "Link must start with https://");

// Pagination schema
export const paginationSchema = object({
    page: string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : undefined))
        .refine((val) => val === undefined || (val > 0 && !isNaN(val)), {
            message: "Page must be a positive number",
        }),
    limit: string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : undefined))
        .refine((val) => val === undefined || (val > 0 && !isNaN(val)), {
            message: "Limit must be a positive number",
        }),
});
