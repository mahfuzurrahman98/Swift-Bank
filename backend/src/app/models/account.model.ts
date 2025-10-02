import { Schema, model, models, Model } from "mongoose";
import { Account } from "@/app/interfaces/account.interface";

/**
 * Account schema definition matching the existing server structure
 */
const accountSchema = new Schema<Account>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
        beneficiaryIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "accounts",
            },
        ],
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Create and export the Account model
export const AccountModel: Model<Account> =
    models.accounts || model("accounts", accountSchema);
