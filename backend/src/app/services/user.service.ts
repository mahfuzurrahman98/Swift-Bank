import { CustomError } from "@/utils/custom-error";
import { RequestUser } from "@/app/interfaces/auth.interface";
import { UserModel } from "@/app/models/user.model";
import { toRequestUser } from "@/app/serializers/user.serializer";
import { User } from "@/app/interfaces/user.interface";

export class UserService {
    /**
     * Gets a user by ID.
     *
     * @param {string} id - The user ID
     * @returns {Promise<RequestUser | null>} The user
     */
    async getUserById(id: string): Promise<RequestUser | null> {
        try {
            const user = await UserModel.findById(id).lean().exec();

            if (!user) {
                return null;
            }

            return toRequestUser(user);
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[userService_getUserById]: ${error.message}`
                  );
        }
    }

    /**
     * Gets a user by email.
     *
     * @param {string} email - The user email
     * @returns {Promise<RequestUser | null>} The user
     */
    async getUserByEmail(email: string): Promise<RequestUser | null> {
        try {
            const user: User | null = await UserModel.findOne({ email })
                .lean()
                .exec();

            if (!user) {
                throw new CustomError(404, "User not found");
            }

            return toRequestUser(user);
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[userService_getUserByEmail]: ${error.message}`
                  );
        }
    }
}
