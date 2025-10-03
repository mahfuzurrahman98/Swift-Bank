import { string, number, object, boolean, nativeEnum } from "zod";
import { TransactionType } from "@/app/enums/transaction.enum";
import { paginationSchema } from "@/app/schemas/common";
import { isValidObjectId } from "mongoose";

// MongoDB ObjectId schemas with context-specific messages
const accountIdSchema = string()
    .trim()
    .min(1, "Account ID is required")
    .refine(isValidObjectId, {
        message: "Please enter a valid account no. (24 hex characters)",
    });

const userIdSchema = string()
    .trim()
    .min(1, "User ID is required")
    .refine(isValidObjectId, {
        message: "Please enter a valid user ID (24 hex characters)",
    });

const beneficiaryIdSchema = string()
    .trim()
    .min(1, "Beneficiary ID is required")
    .refine(isValidObjectId, {
        message: "Please enter a valid beneficiary ID (24 hex characters)",
    });

const genericIdSchema = string()
    .trim()
    .min(1, "ID is required")
    .refine(isValidObjectId, {
        message: "Please enter a valid ID (24 hex characters)",
    });

export const depositSchema = object({
    amount: number()
        .positive("Amount must be positive")
        .max(1000000, "Amount cannot exceed $1,000,000"),
});

export const withdrawSchema = object({
    amount: number()
        .positive("Amount must be positive")
        .max(1000000, "Amount cannot exceed $1,000,000"),
});

export const transferSchema = object({
    toAccountId: accountIdSchema,
    amount: number()
        .positive("Amount must be positive")
        .max(1000000, "Amount cannot exceed $1,000,000"),
});

export const addBeneficiarySchema = object({
    beneficiaryId: beneficiaryIdSchema,
});

export const beneficiaryIdParamSchema = object({
    _id: genericIdSchema,
});

export const transactionsQueryParamsSchema = paginationSchema
    .extend({
        startDate: string()
            .optional()
            .refine(
                (date) => !date || !isNaN(Date.parse(date)),
                "Invalid start date format"
            ),
        endDate: string()
            .optional()
            .refine(
                (date) => !date || !isNaN(Date.parse(date)),
                "Invalid end date format"
            ),
        type: nativeEnum(TransactionType).optional(),
        q: string().trim().optional(),
    })
    .refine(
        (data) => {
            if (data.startDate && data.endDate) {
                return new Date(data.startDate) <= new Date(data.endDate);
            }
            return true;
        },
        {
            message: "Start date must be before or equal to end date",
            path: ["startDate"],
        }
    );
