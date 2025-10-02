import { Schema, model, models, Model } from "mongoose";
import { SelfTransaction } from "@/app/interfaces/transaction.interface";
import { TransactionType } from "@/app/enums/transaction.enum";

/**
 * Self transaction schema definition for deposits and withdrawals
 */
const selfTransactionSchema = new Schema<SelfTransaction>(
    {
        accountId: {
            type: String,
            ref: "accounts",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        type: {
            type: String,
            required: true,
            enum: TransactionType,
        },

        balance: {
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

// Create and export the SelfTransaction model
export const SelfTransactionModel: Model<SelfTransaction> =
    models.self_transactions ||
    model("self_transactions", selfTransactionSchema);
