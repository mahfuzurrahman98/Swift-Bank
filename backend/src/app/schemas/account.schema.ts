import { string, number, object, boolean, nativeEnum } from "zod";
import { TransactionType } from "@/app/enums/transaction.enum";
import { paginationSchema } from "@/app/schemas/common";

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
    toAccountId: string().trim().min(1, "Destination account ID is required"),
    amount: number()
        .positive("Amount must be positive")
        .max(1000000, "Amount cannot exceed $1,000,000"),
});

export const addBeneficiarySchema = object({
    beneficiaryId: string().trim().min(1, "Beneficiary ID is required"),
});

export const beneficiaryIdParamSchema = object({
    _id: string().trim().min(1, "Beneficiary ID is required"),
});

export const createAccountSchema = object({
    userId: string().trim().min(1, "User ID is required"),
    balance: number().min(0, "Balance cannot be negative").optional(),
    active: boolean().optional(),
});

export const updateAccountSchema = object({
    active: boolean().optional(),
});

export const createBeneficiarySchema = object({
    beneficiaryId: string().trim().min(1, "Beneficiary ID is required"),
});

export const updateBeneficiarySchema = object({
    beneficiaryId: string().trim().min(1, "Beneficiary ID is required"),
});

export const accountQuerySchema = object({
    userId: string().trim().optional(),
    active: boolean().optional(),
});

export const beneficiaryQuerySchema = object({
    accountId: string().trim().optional(),
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
