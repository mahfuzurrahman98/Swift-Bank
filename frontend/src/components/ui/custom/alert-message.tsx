import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertMessageType = "default" | "success" | "error" | "warning";

interface AlertMessageProps {
    message: string;
    title?: string;
    type?: AlertMessageType;
    hideTitle?: boolean;
    className?: string;
}

export const AlertMessage = ({
    message,
    title,
    type = "default",
    hideTitle = false,
    className,
}: AlertMessageProps) => {
    // Define styles and icons based on type
    const styles = {
        default: "bg-card text-card-foreground border-muted",
        success: "bg-green-100 text-green-800 border-green-200",
        error: "bg-destructive/15 text-destructive border-destructive/30",
        warning: "bg-amber-50 text-amber-800 border-amber-200",
    };

    const descStyles = {
        default: "text-gray-500 dark:text-gray-600",
        success: "text-gray-500 dark:text-gray-600",
        error: "text-gray-500 dark:text-gray-400",
        warning: "text-gray-500 dark:text-gray-600",
    };

    const icons = {
        default: <Info className="size-4" />,
        success: <CheckCircle2 className="size-4" />,
        error: <AlertCircle className="size-4" />,
        warning: <AlertTriangle className="size-4" />,
    };

    // Default titles if not provided
    const defaultTitles = {
        default: "Information",
        success: "Success",
        error: "Error",
        warning: "Warning",
    };

    return (
        <Alert className={cn(styles[type], className)}>
            {icons[type]}
            {!hideTitle && (title || defaultTitles[type]) && (
                <AlertTitle>{title || defaultTitles[type]}</AlertTitle>
            )}
            <AlertDescription className={descStyles[type]}>
                {message}
            </AlertDescription>
        </Alert>
    );
}
