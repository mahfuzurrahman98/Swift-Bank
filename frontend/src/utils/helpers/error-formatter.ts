import { CustomError } from "@/utils/CustomError";

export const formatError = (error: any): string => {
    if (error instanceof CustomError) {
        if (error.getStatusCode() < 500) {
            return error.getMessage() as string;
        }

        return "Something went wrong";
    }

    return error.message as string;
};
