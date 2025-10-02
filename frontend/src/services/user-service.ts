import {
    FetchClient,
    createRequest,
    type ApiResponse,
} from "@/api/fetchClient";
import { useAuthStore } from "@/stores/auth-store";
import { logger } from "@/utils/helpers/logger";
import type { UserSettingsFormResponse } from "@/utils/interfaces/user-interfaces";
import type {
    VendorProfileSettingsPayload,
    UserProfileSettingsPayload,
} from "@/utils/schemas/user-schema";

export const UserService = {
    async updateUser(
        userId: string,
        payload: VendorProfileSettingsPayload | UserProfileSettingsPayload
    ): Promise<ApiResponse<UserSettingsFormResponse>> {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            if (!accessToken) {
                throw new Error("Authentication required");
            }

            const request: FetchClient = createRequest(
                `users/${userId}/profile`,
                "PUT",
                accessToken
            );
            return await request.call<UserSettingsFormResponse>(payload);
        } catch (error: any) {
            logger.error("Error updating user:", error);
            throw error;
        }
    },

    async getUser(
        userId: string
    ): Promise<ApiResponse<UserSettingsFormResponse>> {
        try {
            const accessToken = useAuthStore.getState().accessToken;
            if (!accessToken) {
                throw new Error("Authentication required");
            }

            const request: FetchClient = createRequest(
                `users/${userId}/profile`,
                "GET",
                accessToken
            );
            return await request.call<UserSettingsFormResponse>();
        } catch (error: any) {
            logger.error("Error fetching user:", error);
            throw error;
        }
    },
};
