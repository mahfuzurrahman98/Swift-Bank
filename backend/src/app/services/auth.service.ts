import { autoInjectable } from "tsyringe";
import { TokenService } from "@/app/services/token.service";
import { RequestUser } from "@/app/interfaces/auth.interface";
import { CustomError } from "@/utils/custom-error";
import { UserModel } from "@/app/models/user.model";
import { toRequestUser } from "@/app/serializers/user.serializer";
import { UserStatus } from "@/app/enums/user";

/**
 * Service class handling user authentication operations including sign-in and token refresh.
 */
@autoInjectable()
export class AuthService {
    private tokenService: TokenService;

    /**
     * Constructor for AuthService.
     *
     * @param {TokenService} tokenService - The token service
     */
    constructor(tokenService: TokenService) {
        this.tokenService = tokenService;
    }

    /**
     * Handles token refresh operation.
     *
     * @param {string} refreshToken - Valid refresh token
     * @returns {Promise<RequestUser>} Authenticated user information
     * @throws {CustomError} When refresh token is invalid or user account is deactivated/suspended
     */
    async refreshToken(refreshToken: string): Promise<RequestUser> {
        try {
            const decoded = this.tokenService.decodeRefreshToken(refreshToken);
            const decodedUser = decoded.user;
            const user = await UserModel.findById(decodedUser?._id);
            if (!user) {
                throw new CustomError(401, "Unauthorized: User not found");
            }

            if (user.status !== UserStatus.ACTIVE) {
                throw new CustomError(403, "Your account is deactivated");
            }
            const reqUser: RequestUser = toRequestUser(user);
            return reqUser;
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[authService_refreshToken]: ${error.message}`
                  );
        }
    }
}
