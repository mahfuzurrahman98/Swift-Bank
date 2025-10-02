import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { FetchClient, createRequest } from "@/api/fetchClient";
import { useAuthStore } from "@/stores/auth-store";
import { GlobalLoader } from "@/components/loaders/GlobalLoader";
import { logger } from "@/utils/helpers/logger";
import type { SigninResponse } from "@/utils/interfaces/auth-interfaces";

export const PersistSessionComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { accessToken, setAccessToken, setUser } = useAuthStore();

    useEffect(() => {
        let isMounted = true;

        const refreshToken = async () => {
            try {
                const request: FetchClient = createRequest(
                    "auth/refresh-token",
                    "POST"
                );
                const response = await request.call<SigninResponse>();
                const { accessToken: _accessToken, user } = response.data;
                setAccessToken(_accessToken);
                setUser(user);
            } catch (error: any) {
                logger.error("Refresh token error:", error);
            } finally {
                isMounted && setIsLoading(false);
            }
        };

        // Only try to refresh if we don't have a token
        !accessToken ? refreshToken() : setIsLoading(false);

        return () => {
            isMounted = false;
        };
    }, [accessToken, setAccessToken, setUser]);

    return <>{isLoading ? <GlobalLoader /> : <Outlet />}</>;
};
