"use client";

import { useState } from "react";
import { X, ChevronDown, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    value: Option[];
    onChange: (selected: Option[]) => void;
    placeholder?: string;
    commandPlaceholder?: string;
    className?: string;
    creatable?: boolean;
    onCreateOption?: (inputValue: string) => Option;
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Select options...",
    commandPlaceholder = "Search options...",
    className,
    creatable = false,
    onCreateOption,
}: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleUnselect = (option: Option) => {
        onChange(value.filter((s) => s.value !== option.value));
    };

    const handleSelect = (option: Option) => {
        if (value.find((s) => s.value === option.value)) {
            handleUnselect(option);
        } else {
            onChange([...value, option]);
        }
    };

    const handleCreateOption = () => {
        if (inputValue && onCreateOption && creatable) {
            const newOption = onCreateOption(inputValue);
            if (!value.find((s) => s.value === newOption.value)) {
                onChange([...value, newOption]);
            }
            setInputValue("");
        }
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    const showCreateOption =
        creatable &&
        inputValue &&
        filteredOptions.length === 0 &&
        !value.some(
            (option) => option.label.toLowerCase() === inputValue.toLowerCase()
        );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between text-left font-normal min-h-[40px] py-2 h-auto cursor-default hover:unset",
                        className
                    )}
                >
                    <div className="flex flex-wrap items-center gap-2 flex1">
                        {value.length > 0 ? (
                            value.map((option) => (
                                <Badge variant="secondary" key={option.value}>
                                    {option.label}
                                    <span
                                        className="cursor-pointer text-muted-foreground hover:text-red-400 dark:hover:text-red-500"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUnselect(option);
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleUnselect(option);
                                        }}
                                    >
                                        <X className="h-3 w-3 " />
                                    </span>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                    </div>
                    <ChevronDown className="size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="popover-content-width-full p-0"
                align="start"
            >
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={commandPlaceholder}
                        value={inputValue}
                        onValueChange={setInputValue}
                    />
                    <CommandList>
                        {!showCreateOption && (
                            <CommandEmpty>No options found.</CommandEmpty>
                        )}
                        <CommandGroup>
                            {filteredOptions.map((option, index) => (
                                <CommandItem
                                    key={`${option.value}-${index}`}
                                    onSelect={() => handleSelect(option)}
                                    className="cursor-pointer"
                                >
                                    {option.label}
                                    <Check
                                        className={cn(
                                            "ml-auto mr-2 size-4",
                                            value.find(
                                                (s) => s.value === option.value
                                            )
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}

                            {showCreateOption && (
                                <CommandItem
                                    onSelect={handleCreateOption}
                                    className="cursor-pointer"
                                >
                                    <Plus />
                                    Create {inputValue}
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
