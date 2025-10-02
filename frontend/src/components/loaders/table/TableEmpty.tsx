import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TableEmptyProps {
    message?: string;
    className?: string;
}

export function TableEmpty({
    message = "No data found",
    className,
}: TableEmptyProps) {
    return (
        <Card className={`w-full ${className}`}>
            <CardContent className="flex flex-col items-center justify-center py-10">
                <Search className="size-16 text-muted-foreground" />
                {message && (
                    <div className="mt-4 text-lg text-muted-foreground">
                        {message}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
