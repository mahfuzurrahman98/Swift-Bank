import { Loader2 } from "lucide-react";

interface SimpleLoaderProps {
    message?: string;
    className?: string;
}

export function SimpleLoader({ message, className }: SimpleLoaderProps) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Loader2 className="size-12 animate-spin text-primary" />
            {message && (
                <div className="ml-2 text-sm text-muted-foreground">
                    {message}
                </div>
            )}
        </div>
    );
}
