import { string, number, object, nativeEnum, type infer as zInfer } from "zod";
import { paginationSchema } from "@/utils/schemas/common-schemas";
import { TransactionType } from "@/utils/enums/transaction";
import { isValidMongoIdRegex } from "@/utils/helpers";

export const depositSchema = object({
    amount: string()
        .min(1, "Amount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Amount must be a positive number",
        })
        .refine((val) => Number(val) <= 1000000, {
            message: "Amount cannot exceed $1,000,000",
        }),
});

export const withdrawSchema = object({
    amount: string()
        .min(1, "Amount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Amount must be a positive number",
        })
        .refine((val) => Number(val) <= 1000000, {
            message: "Amount cannot exceed $1,000,000",
        }),
});

export const transferSchema = object({
    toAccountId: string()
        .trim()
        .min(1, "Destination account ID is required")
        .refine(isValidMongoIdRegex, {
            message: "Please enter a valid account no. (24 hex characters)",
        }),
    amount: number()
        .positive("Amount must be positive")
        .max(1000000, "Amount cannot exceed $1,000,000"),
});

export const addBeneficiarySchema = object({
    beneficiaryId: string()
        .trim()
        .min(1, "Beneficiary ID is required")
        .refine(isValidMongoIdRegex, {
            message: "Please enter a valid account no. (24 hex characters)",
        }),
});

export const beneficiaryQuerySchema = object({
    accountId: string()
        .trim()
        .optional()
        .refine((val) => !val || isValidMongoIdRegex(val), {
            message:
                "Please enter a valid MongoDB ObjectId (24 hex characters)",
        }),
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

// Payload Types (form data - strings from HTML inputs)
export type DepositPayload = zInfer<typeof depositSchema>;
export type WithdrawPayload = zInfer<typeof withdrawSchema>;
export type TransferPayload = zInfer<typeof transferSchema>;
export type AddBeneficiaryPayload = zInfer<typeof addBeneficiarySchema>;
export type BeneficiaryQueryPayload = zInfer<typeof beneficiaryQuerySchema>;
export type TransactionsQueryParamsPayload = zInfer<
    typeof transactionsQueryParamsSchema
>;
