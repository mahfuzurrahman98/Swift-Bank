import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TableLoaderProps {
    message?: string;
    className?: string;
}

export function TableLoader({
    message = "Loading data...",
    className,
}: TableLoaderProps) {
    return (
        <Card className={`w-full ${className}`}>
            <CardContent className="flex flex-col items-center justify-center py-10">
                <Loader2 className="size-16 animate-spin text-primary" />
                {message && (
                    <div className="mt-4 text-lg text-muted-foreground">
                        {message}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
