import { useAuthStore } from "@/stores/auth-store";
import { CustomError } from "@/utils/CustomError";
import { logger } from "@/utils/helpers/logger";

// Types for API responses and requests
interface FetchOptions extends RequestInit {
    retry?: boolean;
}

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiResponse<T = any> {
    message: string;
    data: T;
}

// Base URL for API requests
const API_URL: string =
    (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:8000";

/**
 * Creates a full API URL from a path
 */
const createApiUrl = (path: string): string => {
    path = path.trim().replace(/^\/+|\/+$/g, "");
    return `${API_URL}/${path}`;
};

/**
 * Standalone API client that can be used anywhere in the application
 * without React hooks dependency
 */
export class FetchClient {
    private accessToken: string | null = null;
    private endpoint: string;
    private method: RequestMethod;

    constructor(
        endpoint: string,
        method: RequestMethod,
        accessToken: string | null = null
    ) {
        this.accessToken = accessToken;
        this.endpoint = endpoint;
        this.method = method;
    }

    /**
     * Refresh the access token
     * Returns the new token if successful, null otherwise
     */
    private async refreshToken(): Promise<string | null> {
        try {
            const url = createApiUrl("auth/refresh-token");
            const response = await fetch(url, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }

            const jsonResponse = await response.json();

            if (jsonResponse.data?.accessToken) {
                // Update the token internally
                this.accessToken = jsonResponse.data.accessToken;

                // Update the token in auth store
                useAuthStore.getState().setAccessToken(this.accessToken);

                return jsonResponse.data.accessToken;
            }

            return null;
        } catch (error: any) {
            logger.error("Error refreshing token:", error.message);
            return null;
        }
    }

    /**
     * Make an API request with or without authentication
     * Handles token refresh automatically if needed and token is provided
     * @param body Optional request body (any type including FormData)
     * @param options Additional fetch options
     */
    async call<T = any>(
        body?: FormData | string | object,
        options: FetchOptions = {}
    ): Promise<ApiResponse<T>> {
        const { retry = true, ...fetchOptions } = options;

        // Set default headers if not provided
        if (!fetchOptions.headers) {
            fetchOptions.headers = {};
        }

        // Add content type if not already set and body is not FormData
        // (FormData sets its own content-type with boundary)
        const headers = fetchOptions.headers as Record<string, string>;
        if (!headers["Content-Type"] && body && !(body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        // Add authorization header if we have a token
        if (this.accessToken) {
            headers["Authorization"] = `Bearer ${this.accessToken}`;
        }

        // Set method from constructor
        fetchOptions.method = this.method;

        // Add body for requests if provided
        if (body) {
            // If body is FormData, use it directly
            // Otherwise, stringify it if it's not already a string
            fetchOptions.body =
                body instanceof FormData
                    ? body
                    : typeof body === "string"
                    ? body
                    : JSON.stringify(body);
        }

        try {
            const url = createApiUrl(this.endpoint);

            let response = await fetch(url, {
                ...fetchOptions,
                credentials: "include",
            });

            // If unauthorized and retry is enabled and we have a token, try to refresh token
            if (response.status === 401 && retry && this.accessToken) {
                const newToken = await this.refreshToken();

                if (!newToken) {
                    throw new Error("Failed to refresh token");
                }

                // Update authorization header with new token
                headers["Authorization"] = `Bearer ${newToken}`;

                // Retry the request with new token
                response = await fetch(url, {
                    ...fetchOptions,
                    credentials: "include",
                });
            }

            const contentType =
                response.headers.get("Content-Type") ||
                response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const jsonResponse = await response.json();

                if (!response.ok) {
                    throw new CustomError(
                        response.status,
                        jsonResponse.message
                    );
                }

                return {
                    message: jsonResponse.message,
                    data: jsonResponse.data,
                } as ApiResponse<T>;
            } else {
                // Handle non-JSON (e.g., file blob)
                const blob = await response.blob();

                // This line depends on your use case (e.g., preview, download, etc.)
                // You might return blob, or createObjectURL, or just return raw blob
                return {
                    message: "File blob response",
                    data: blob as any,
                } as ApiResponse<T>;
            }
        } catch (error: any) {
            logger.error(`Error fetching ${this.endpoint}, ${error}`);
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(
                    500,
                    error.message || "Unknown error occurred"
                );
            }
        }
    }
}

/**
 * Create a new API request
 * @param endpoint API endpoint path
 * @param method HTTP method
 * @param accessToken Optional access token
 * @returns A new FetchClient instance
 */
export const createRequest = (
    endpoint: string,
    method: RequestMethod,
    accessToken: string | null = null
): FetchClient => {
    return new FetchClient(endpoint, method, accessToken);
};
