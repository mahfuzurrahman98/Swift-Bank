import { Schema, model, models, Model } from "mongoose";
import { FundTransferTransaction } from "@/app/interfaces/transaction.interface";

/**
 * Fund transfer transaction schema definition for money transfers between accounts
 */
const fundTransferSchema = new Schema<FundTransferTransaction>(
    {
        fromAccountId: {
            type: String,
            ref: "accounts",
            required: true,
            index: true,
        },
        toAccountId: {
            type: String,
            ref: "accounts",
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        fromAccountBalance: {
            type: Number,
            required: true,
        },
        toAccountBalance: {
            type: Number,
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Create and export the FundTransfer model
export const FundTransferModel: Model<FundTransferTransaction> =
    models.fund_transfers || model("fund_transfers", fundTransferSchema);
