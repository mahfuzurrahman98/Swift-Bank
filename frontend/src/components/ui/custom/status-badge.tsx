import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define status types and their corresponding color mappings
export type StatusType =
    | "success"
    | "danger"
    | "warning"
    | "muted"
    | "secondary"
    | "critical"
    | "default";

const statusBadgeVariants = cva(
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] overflow-hidden",
    {
        variants: {
            status: {
                // Green badge for success states (Active, Accepted, etc.)
                success:
                    "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400",

                // Red badge for danger states (Rejected, Failed, etc.)
                danger: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400",

                // Yellow badge for warning states (Pending, In Review, etc.)
                warning:
                    "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",

                // Gray badge for muted states (Inactive, Draft, etc.)
                muted: "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400",

                // Transparent badge for secondary states
                secondary:
                    "border-gray-200 bg-transparent text-gray-700 dark:border-gray-700 dark:text-gray-300",

                // Complete red badge for critical states (Blocked, Error, etc.)
                critical:
                    "border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-500",

                // Default shadcn badge style
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
            },
        },
        defaultVariants: {
            status: "default",
        },
    }
);

export interface StatusBadgeProps
    extends React.ComponentProps<"span">,
        VariantProps<typeof statusBadgeVariants> {
    status?: StatusType;
    children: React.ReactNode;
}

export function StatusBadge({
    className,
    status = "default",
    children,
    ...props
}: StatusBadgeProps) {
    return (
        <span
            className={cn(statusBadgeVariants({ status }), className)}
            {...props}
        >
            {children}
        </span>
    );
}
