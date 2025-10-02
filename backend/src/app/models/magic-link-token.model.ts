import { Schema, model } from "mongoose";
import { MagicLinkToken } from "@/app/interfaces/magic-link.interface";
import { InvalidateByType, DeviceType } from "@/app/enums/magic-link.enum";

const magicLinkTokenSchema = new Schema<MagicLinkToken>(
    {
        userId: {
            type: String,
            ref: "users",
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        requestDevice: {
            userAgent: {
                type: String,
                required: true,
            },
            ipAddress: {
                type: String,
                required: true,
            },
            deviceType: {
                type: String,
                enum: DeviceType,
                required: true,
            },
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        used: {
            type: Boolean,
            default: false,
        },
        usedAt: {
            type: Date,
            default: null,
        },
        invalidatedBy: {
            type: String,
            enum: InvalidateByType,
            default: null,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Indexes for performance
magicLinkTokenSchema.index({ userId: 1, used: 1 });
magicLinkTokenSchema.index({ token: 1 }, { unique: true }); // Unique index on token
magicLinkTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired tokens

export const MagicLinkTokenModel = model<MagicLinkToken>(
    "magic_link_tokens",
    magicLinkTokenSchema
);
