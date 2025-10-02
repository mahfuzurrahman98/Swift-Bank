import { string as zString } from "zod";

export const isValidUUID = (uuid: string): boolean =>
    zString().uuid().safeParse(uuid).success;
export const isValidEmail = (email: string): boolean =>
    zString().email().safeParse(email).success;

export function getInitials(str: string): string {
    // Replace non-alphanumeric (excluding space) with space
    const cleaned = str.replace(/[^a-zA-Z0-9 ]+/g, " ");

    // Normalize multiple spaces and trim
    const words = cleaned.trim().replace(/\s+/g, " ").split(" ");

    // Return initials io
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0]) {
        return words[0][0].toUpperCase();
    }

    return "";
}

export const generateName = (
    firstName: string | null | undefined,
    lastName: string | null | undefined
) => {
    if (firstName == null || firstName === "") {
        firstName = "";
    }
    if (lastName == null || lastName === "") {
        lastName = "";
    }
    return (firstName + " " + lastName).trim();
};

export const limitString = (
    str: string,
    maxLength: number,
    suffix: string = "..."
): string => {
    if (str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength - suffix.length).trimEnd() + suffix;
};

export const textToJson = <T>(text: string): T | null => {
    if (typeof text !== "string") {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch (error: any) {
        return null;
    }
};

export const formatStatus = (str: string, received?: boolean): string => {
    if (str === "sent" && received) {
        return "Received";
    }

    const words = str.split("-");
    return words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const formatCurrency = (
    amount: number,
    currency: string = "USD"
): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(amount);
};

export { formatDate } from "./date";
