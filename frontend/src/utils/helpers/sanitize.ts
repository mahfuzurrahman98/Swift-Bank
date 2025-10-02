function checkIfArrayOfUndefineds<T>(data: T[]): boolean {
    return data.every((item) => item === undefined);
}

/**
 * Recursively converts all blank strings and empty arrays to undefined in data
 * Internal recursive function
 */
function sanitizePayloadRecursive<T>(data: T): T {
    if (data === null || data === undefined) {
        return data;
    }

    // Handle primitive values
    if (typeof data === "string") {
        return (data.trim() === "" ? undefined : data) as T;
    }

    if (typeof data !== "object") {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        const sanitizedArray = data.map((item) =>
            sanitizePayloadRecursive(item)
        );
        // return (sanitizedArray.length === 0 ? undefined : sanitizedArray) as T;
        if (sanitizedArray.length === 0) {
            return [] as T;
        } else {
            if (checkIfArrayOfUndefineds(sanitizedArray)) {
                return undefined as T;
            }
            return sanitizedArray as T;
        }
    }

    // Handle objects
    const result = {} as T;
    for (const [key, value] of Object.entries(data)) {
        (result as any)[key] = sanitizePayloadRecursive(value);
    }

    return result;
}

/**
 * Converts all blank strings to undefined in any data structure
 * Handles objects, arrays, nested structures, and primitive values
 * @param data - The data to sanitize (object, array, or primitive)
 * @returns A new data structure with blank strings converted to undefined
 */
export function sanitizePayload<T>(data: T): T {
    return sanitizePayloadRecursive(data);
}
