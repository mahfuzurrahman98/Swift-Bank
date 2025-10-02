import { logger } from "@/utils/helpers/logger";

export type DateFormatStyle = "short" | "long" | "us";

export interface DateFormatterOptions {
    /**
     * Format style for the date:
     * - 'short': 12 Jun 2025, 11:25 AM
     * - 'long': Thursday, June 12, 2025, 11:25 AM
     * - 'us': 6/12/2025, 11:25 AM (US format)
     */
    formatStyle?: DateFormatStyle;

    /** Timezone offset in format '+06:00' or '-03:00' (default: current browser offset) */
    timeZoneOffset?: string;

    /** Whether to include time in the output (default: true) */
    showTime?: boolean;

    /** Whether to show seconds in the time (default: false) */
    showSeconds?: boolean;

    /** Whether to use 24-hour format instead of 12-hour with AM/PM (default: false) */
    use24HourFormat?: boolean;
}

/**
 * Formats a date string or Date object into a human-readable format
 * @param dateInput - The date to format (string or Date object)
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDate = (
    dateInput: string | Date,
    options: DateFormatterOptions = {}
): string => {
    let {
        formatStyle = "short",
        timeZoneOffset = getCurrentTimezoneOffsetStr(),
        showTime = true,
        showSeconds = false,
        use24HourFormat = false,
    } = options;

    try {
        if (!timeZoneOffset) {
            timeZoneOffset = getCurrentTimezoneOffsetStr();
        }

        let date =
            typeof dateInput === "string"
                ? new Date(dateInput)
                : new Date(dateInput);

        // Handle invalid dates
        if (isNaN(date.getTime())) {
            logger.error("Invalid date:", dateInput);
            return "Invalid date";
        }

        // Apply timezone offset correctly (avoid double offset)
        if (formatStyle === "us") {
            const offsetMinutes = parseTimezoneOffset(timeZoneOffset);
            const adjustedDate = new Date(
                date.getTime() + offsetMinutes * 60000
            );
            return formatUSDateTime(
                adjustedDate,
                showTime,
                showSeconds,
                use24HourFormat
            );
        }
        // Apply timezone offset for other formats
        const offsetMinutes = parseTimezoneOffset(timeZoneOffset);
        date = new Date(date.getTime() + offsetMinutes * 60000);

        const formatter = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            ...(showTime && {
                hour: "numeric",
                minute: "2-digit",
                ...(showSeconds && { second: "2-digit" }),
                hour12: !use24HourFormat,
            }),
            ...(formatStyle === "long" && { weekday: "long" }),
            timeZone: "UTC", // the date is already adjusted, format in UTC context
        });

        let formatted = formatter.format(date);

        formatted = formatted
            .replace(/(\d+)([A-Za-z]+)(\d+)/, "$1 $2 $3")
            .replace(/\b([ap])m\b/gi, (match) => match.toUpperCase());

        return formatted;
    } catch (error: any) {
        logger.error("Error formatting date:", error);
        return "Invalid date";
    }
};

/**
 * Formats a date in US standard format (M/D/YYYY, h:mm A)
 */
function formatUSDateTime(
    date: Date,
    showTime: boolean = true,
    showSeconds: boolean = false,
    use24HourFormat: boolean = false,
    timeZoneOffset?: string
): string {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timeZone: "UTC", // default
    };

    if (showTime) {
        options.hour = "numeric";
        options.minute = "2-digit";
        options.hour12 = !use24HourFormat;

        if (showSeconds) {
            options.second = "2-digit";
        }
    }

    if (timeZoneOffset) {
        options.timeZone = "UTC"; // already adjusted
    }

    return new Intl.DateTimeFormat("en-US", options).format(date);
}

/**
 * Parses a timezone offset string (e.g., '+06:00' or '-03:00') into minutes
 */
function parseTimezoneOffset(offset: string): number {
    const match = offset.match(/^([+-])(\d{2}):(\d{2})$/);
    if (!match) return 0;

    const [, sign, hours, minutes] = match;
    const totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    return sign === "+" ? totalMinutes : -totalMinutes;
}

/**
 * Gets the current browser's timezone offset as '+HH:MM' or '-HH:MM'
 */
export function getCurrentTimezoneOffsetStr(): string {
    const offset = new Date().getTimezoneOffset(); // in minutes
    const absOffset = Math.abs(offset);
    const sign = offset <= 0 ? "+" : "-";
    const hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    const minutes = String(absOffset % 60).padStart(2, "0");
    return `${sign}${hours}:${minutes}`;
}
