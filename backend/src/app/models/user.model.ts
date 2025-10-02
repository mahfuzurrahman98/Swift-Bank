import { Schema, model, models, Model } from "mongoose";
import { User } from "@/app/interfaces/user.interface";
import { UserRole, UserStatus } from "@/app/enums/user";

/**
 * User schema definition matching existing server structure
 */
const userSchema = new Schema<User>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: UserRole,
            required: true,
        },
        status: {
            type: String,
            enum: UserStatus,
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Create and export the User model
export const UserModel: Model<User> =
    models.users || model("users", userSchema);
