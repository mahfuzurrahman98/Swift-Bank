import {
    useEffect,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
} from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
    name?: string;
    required?: boolean;
    dateFormat?: Intl.DateTimeFormatOptions;
    includeTime?: boolean;
    defaultTime?: { hour: number; minute: number };
}

function formatDate(
    date: Date | undefined,
    format?: Intl.DateTimeFormatOptions,
    includeTime?: boolean
) {
    if (!date) {
        return "";
    }

    const defaultFormat: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
    };

    if (includeTime) {
        const dateTimeFormat: Intl.DateTimeFormatOptions = {
            ...defaultFormat,
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        };
        return date.toLocaleString("en-US", format || dateTimeFormat);
    }

    return date.toLocaleDateString("en-US", format || defaultFormat);
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false;
    }
    return !isNaN(date.getTime());
}

function parseDate(dateString: string): Date | undefined {
    if (!dateString.trim()) {
        return undefined;
    }

    const date = new Date(dateString);
    return isValidDate(date) ? date : undefined;
}

// Time helper functions
function formatTime12Hour(date: Date): {
    hour: string;
    minute: string;
    period: "AM" | "PM";
} {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    return {
        hour: hour12.toString(),
        minute: minutes.toString().padStart(2, "0"),
        period,
    };
}

function createDateWithTime(date: Date, hour: number, minute: number): Date {
    const newDate = new Date(date);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
}

function convertTo24Hour(hour: number, period: "AM" | "PM"): number {
    if (period === "AM") {
        return hour === 12 ? 0 : hour;
    } else {
        return hour === 12 ? 12 : hour + 12;
    }
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Select a date",
    disabled = false,
    className,
    id,
    name,
    required = false,
    dateFormat,
    includeTime = false,
    defaultTime = { hour: 23, minute: 59 },
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState<Date | undefined>(value || new Date());

    // Initialize time state from value or default
    const getInitialTimeState = () => {
        if (value && includeTime) {
            return formatTime12Hour(value);
        } else if (includeTime) {
            const defaultDate = new Date();
            defaultDate.setHours(defaultTime.hour, defaultTime.minute, 0, 0);
            return formatTime12Hour(defaultDate);
        }
        return { hour: "12", minute: "00", period: "PM" as const };
    };

    const [selectedHour, setSelectedHour] = useState<string>(
        getInitialTimeState().hour
    );
    const [selectedMinute, setSelectedMinute] = useState<string>(
        getInitialTimeState().minute
    );
    const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(
        getInitialTimeState().period
    );

    // Compute derived state instead of using useEffect
    const internalDate = value;
    const inputValue = formatDate(value, dateFormat, includeTime);

    // Update time state when value prop changes (only when needed)
    useEffect(() => {
        if (value && includeTime) {
            const timeData = formatTime12Hour(value);
            setSelectedHour(timeData.hour);
            setSelectedMinute(timeData.minute);
            setSelectedPeriod(timeData.period);
        }
        if (value) {
            setMonth(value);
        }
    }, [value]);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        let finalDate = selectedDate;

        if (selectedDate && includeTime) {
            // Apply current time selection to the selected date
            const hour24 = convertTo24Hour(
                parseInt(selectedHour),
                selectedPeriod
            );
            finalDate = createDateWithTime(
                selectedDate,
                hour24,
                parseInt(selectedMinute)
            );
        }

        if (!includeTime) {
            setOpen(false);
        }

        if (onChange) {
            onChange(finalDate);
        }
    };

    // Handle time selector changes
    const handleHourChange = (hour: string) => {
        setSelectedHour(hour);
        if (internalDate && includeTime && onChange) {
            const hour24 = convertTo24Hour(parseInt(hour), selectedPeriod);
            const finalDate = createDateWithTime(
                internalDate,
                hour24,
                parseInt(selectedMinute)
            );
            onChange(finalDate);
        }
    };

    const handleMinuteChange = (minute: string) => {
        setSelectedMinute(minute);
        if (internalDate && includeTime && onChange) {
            const hour24 = convertTo24Hour(
                parseInt(selectedHour),
                selectedPeriod
            );
            const finalDate = createDateWithTime(
                internalDate,
                hour24,
                parseInt(minute)
            );
            onChange(finalDate);
        }
    };

    const handlePeriodChange = (period: "AM" | "PM") => {
        setSelectedPeriod(period);
        if (internalDate && includeTime && onChange) {
            const hour24 = convertTo24Hour(parseInt(selectedHour), period);
            const finalDate = createDateWithTime(
                internalDate,
                hour24,
                parseInt(selectedMinute)
            );
            onChange(finalDate);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;

        const parsedDate = parseDate(inputVal);
        if (parsedDate) {
            setMonth(parsedDate);
            if (onChange) {
                onChange(parsedDate);
            }
        } else if (inputVal === "") {
            if (onChange) {
                onChange(undefined);
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown" && !disabled) {
            e.preventDefault();
            setOpen(true);
        }
    };

    return (
        <div className={cn("relative flex gap-2", className)}>
            <Input
                id={id}
                name={name}
                value={inputValue}
                placeholder={placeholder}
                className="bg-background pr-10"
                disabled={disabled}
                required={required}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={disabled}
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                >
                    <div className="flex flex-col">
                        <Calendar
                            mode="single"
                            selected={internalDate}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={handleDateSelect}
                            disabled={disabled}
                        />

                        {includeTime && (
                            <div className="border-t p-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Clock className="size-4" />
                                    Time
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Hour Selection */}
                                    <Select
                                        value={selectedHour}
                                        onValueChange={handleHourChange}
                                        disabled={disabled}
                                    >
                                        <SelectTrigger className="w-16">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from(
                                                { length: 12 },
                                                (_, i) => i + 1
                                            ).map((hour) => (
                                                <SelectItem
                                                    key={hour}
                                                    value={hour.toString()}
                                                >
                                                    {hour}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <span className="text-muted-foreground">
                                        :
                                    </span>

                                    {/* Minute Selection */}
                                    <Select
                                        value={selectedMinute}
                                        onValueChange={handleMinuteChange}
                                        disabled={disabled}
                                    >
                                        <SelectTrigger className="w-16">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from(
                                                { length: 60 },
                                                (_, i) => i
                                            ).map((minute) => (
                                                <SelectItem
                                                    key={minute}
                                                    value={minute
                                                        .toString()
                                                        .padStart(2, "0")}
                                                >
                                                    {minute
                                                        .toString()
                                                        .padStart(2, "0")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* AM/PM Selection */}
                                    <Select
                                        value={selectedPeriod}
                                        onValueChange={handlePeriodChange}
                                        disabled={disabled}
                                    >
                                        <SelectTrigger className="w-16">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AM">
                                                AM
                                            </SelectItem>
                                            <SelectItem value="PM">
                                                PM
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
