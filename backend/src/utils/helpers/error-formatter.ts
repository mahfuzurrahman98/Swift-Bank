import { CustomError } from '@/utils/custom-error';

/**
 * Formats errors consistently across the application.
 * Converts unknown errors to CustomError instances with proper structure.
 *
 * @param error - The error to format (can be CustomError, Error, or any other type)
 * @returns A properly formatted CustomError instance
 */
export function formatError(error: any): CustomError {
    // If it's already a CustomError, return as-is
    if (error instanceof CustomError) {
        return error;
    }

    // If it's a standard Error, wrap it
    if (error instanceof Error) {
        return new CustomError(500, error.message);
    }

    // If it's a string, create an error with it
    if (typeof error === 'string') {
        return new CustomError(500, error);
    }

    // For any other type, create a generic error
    return new CustomError(500, 'An unexpected error occurred');
}