import { sign, verify } from "jsonwebtoken";
import { RequestUser, TokenPayload } from "@/app/interfaces/auth.interface";
import { CustomError } from "@/utils/custom-error";

export class TokenService {
    /**
     * Creates an access token.
     *
     * @param {RequestUser} user - The user
     * @returns {string} The access token
     */
    createAccessToken(user: RequestUser): string {
        let expiresIn: number;

        try {
            // ACCESS_TOKEN_EXPIRY is in minutes
            const expiryMinutes = parseInt(
                process.env.ACCESS_TOKEN_EXPIRY as string
            );
            expiresIn = expiryMinutes * 60 || 60 * 5; // Default to 5 minutes
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[tokenService_createAccessToken_expiry]: ${error.message}`
                  );
        }

        try {
            const token = sign({ user }, process.env.ACCESS_TOKEN_SECRET!, {
                expiresIn,
                algorithm: "HS256",
            });
            return token;
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      401,
                      `[tokenService_createAccessToken_sign]: ${
                          error.message || "Unauthorized"
                      }`
                  );
        }
    }

    /**
     * Creates a refresh token.
     *
     * @param {RequestUser} user - The user
     * @returns {string} The refresh token
     */
    createRefreshToken(user: RequestUser): string {
        let expiresIn: number;
        try {
            // REFRESH_TOKEN_EXPIRY is in days
            const expiryDays = parseInt(
                process.env.REFRESH_TOKEN_EXPIRY as string
            );
            expiresIn = expiryDays * 60 * 60 * 24 || 60 * 60 * 24 * 7; // Default to 7 days
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[tokenService_createRefreshToken_expiry]: ${error.message}`
                  );
        }

        try {
            const token = sign({ user }, process.env.REFRESH_TOKEN_SECRET!, {
                expiresIn,
                algorithm: "HS256",
            });
            return token;
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      401,
                      `[tokenService_createRefreshToken_sign]: ${
                          error.message || "Unauthorized"
                      }`
                  );
        }
    }

    /**
     * Decodes an access token.
     *
     * @param {string} token - The access token
     * @returns {TokenPayload} The token payload
     */
    decodeAccessToken(token: string): TokenPayload {
        try {
            const tokenPayload = verify(
                token,
                process.env.ACCESS_TOKEN_SECRET as string
            ) as TokenPayload;
            return tokenPayload;
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      401,
                      `[tokenService_decodeAccessToken]: ${
                          error.message || "Unauthorized"
                      }`
                  );
        }
    }

    /**
     * Decodes a refresh token.
     *
     * @param {string} token - The refresh token
     * @returns {TokenPayload} The token payload
     */
    decodeRefreshToken(token: string): TokenPayload {
        try {
            const tokenPayload = verify(
                token,
                process.env.REFRESH_TOKEN_SECRET as string
            ) as TokenPayload;
            return tokenPayload;
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      401,
                      `[tokenService_decodeRefreshToken]: ${
                          error.message || "Unauthorized"
                      }`
                  );
        }
    }
}
