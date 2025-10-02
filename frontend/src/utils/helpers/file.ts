import { FetchClient, createRequest } from "@/api/fetchClient";
import {
    ACCEPTED_FILE_EXTENSIONS,
    ACCEPTED_FILE_MIME_TYPES,
    TEXT_BASED_MIME_TYPES,
} from "@/lib/data/accepted-file-types";
import { useAuthStore } from "@/stores/auth-store";
import { logger } from "@/utils/helpers/logger";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Helper function to check if a file is accepted
export const isFileAccepted = (file: File): boolean => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    return (
        (ACCEPTED_FILE_MIME_TYPES.includes(file.type) ||
            TEXT_BASED_MIME_TYPES.includes(file.type) ||
            ACCEPTED_FILE_EXTENSIONS.includes(extension)) &&
        file.size <= MAX_FILE_SIZE
    );
};

export const formatFileSize = (bytes: number) => {
    if (bytes === 0) {
        return "0 Bytes";
    }
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
        Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
};

export async function loadFile(
    filePath: string,
    secure: boolean = false
): Promise<string> {
    let endpoint = "";

    if (filePath.startsWith("/")) {
        endpoint = `/storage${filePath}`;
    } else {
        endpoint = `/storage/${filePath}`;
    }

    try {
        let request: FetchClient;
        let accessToken: string | null = null;

        if (secure) {
            accessToken = useAuthStore.getState().accessToken;

            if (!accessToken) {
                throw new Error("No access token found");
            }

            request = createRequest(endpoint, "GET", accessToken);
        } else {
            request = createRequest(endpoint, "GET");
        }

        const { data } = await request.call();

        if (!(data instanceof Blob)) {
            throw new Error("Expected Blob response, got something else");
        }

        return URL.createObjectURL(data);
    } catch (error: any) {
        logger.error("Error loading secure file:", error);
        // throw error;
        return "";
    }
}

export const getFileExtension = (filename: string) =>
    filename.split(".").pop()?.toLowerCase() || "";

export const isPdfFile = (filename: string) =>
    getFileExtension(filename) === "pdf";
