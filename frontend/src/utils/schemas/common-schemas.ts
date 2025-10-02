import { literal, string } from "zod";

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

// Valid first name schema
export const firstNameSchema = string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters");

// Valid last name schema
export const lastNameSchema = string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .or(literal(""))
    .optional();
