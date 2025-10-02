import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { formatDate } from "@/utils/helpers/date";

export function DateTooltip({
    date,
    timezone,
}: {
    date: Date;
    timezone?: string;
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="cursor-help" asChild>
                    <span>
                        {formatDate(date, {
                            formatStyle: "us",
                            timeZoneOffset: timezone,
                        })}
                    </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                    {formatDate(date, {
                        formatStyle: "long",
                        timeZoneOffset: timezone,
                    })}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
