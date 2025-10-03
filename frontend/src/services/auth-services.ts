import {
    FetchClient,
    createRequest,
    type ApiResponse,
} from "@/api/fetchClient";
import type { SigninResponse } from "@/utils/interfaces/auth-interfaces";
import type { MagicLinkPayload } from "@/utils/schemas/auth-schema";

/**
 * Authentication Service
 * Handles all authentication related API calls
 */
export const AuthService = {
    /**
     * Request a magic link for authentication
     * @param payload Email data
     * @returns Magic link response
     */
    async requestMagicLink(
        payload: MagicLinkPayload
    ): Promise<ApiResponse<{ message: string }>> {
        try {
            const request: FetchClient = createRequest(
                "auth/magic-link",
                "POST"
            );
            return await request.call<{ message: string }>(payload);
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Verify magic link token and authenticate user
     * @param token Magic link token from URL
     * @returns Signin response with tokens and user data
     */
    async verifyMagicLink(token: string): Promise<ApiResponse<SigninResponse>> {
        try {
            const request: FetchClient = createRequest(
                `auth/verify-magic-link/${token}`,
                "GET"
            );
            return await request.call<SigninResponse>();
        } catch (error: any) {
            throw error;
        }
    },

    async signout(): Promise<void> {
        try {
            const request: FetchClient = createRequest("auth/signout", "POST");
            await request.call();
        } catch (error: any) {
            throw error;
        }
    },
};
