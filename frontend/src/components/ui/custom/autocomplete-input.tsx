import {
    useState,
    useRef,
    useEffect,
    forwardRef,
    type ChangeEvent,
    type KeyboardEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface AutocompleteInputProps {
    placeholder?: string;
    suggestions?: string[];
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    name?: string;
    disabled?: boolean;
}

const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
    (
        {
            placeholder = "Type anything...",
            suggestions = [],
            className = "",
            value = "",
            onChange,
            onBlur,
            name,
            disabled,
            ...props
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const [filteredSuggestions, setFilteredSuggestions] = useState<
            string[]
        >([]);
        const [selectedIndex, setSelectedIndex] = useState(-1);

        const containerRef = useRef<HTMLDivElement>(null);

        // Filter suggestions based on input value
        useEffect(() => {
            if (value.trim() === "") {
                setFilteredSuggestions([]);
                setIsOpen(false);
                return;
            }

            const filtered = suggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            );

            setFilteredSuggestions(filtered);
            setIsOpen(filtered.length > 0);
            setSelectedIndex(-1);
        }, [value, suggestions]);

        // Handle input change
        const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            onChange?.(newValue);
        };

        // Handle suggestion selection
        const handleSuggestionSelect = (suggestion: string) => {
            onChange?.(suggestion);
            setIsOpen(false);
            setSelectedIndex(-1);
        };

        // Handle keyboard navigation
        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (!isOpen || filteredSuggestions.length === 0) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
                    );
                    break;
                case "Enter":
                    e.preventDefault();
                    if (filteredSuggestions.length > 0) {
                        const indexToSelect =
                            selectedIndex >= 0 ? selectedIndex : 0;
                        handleSuggestionSelect(
                            filteredSuggestions[indexToSelect]
                        );
                        // blur input after selection
                        if (ref && typeof ref !== "function" && ref?.current) {
                            ref.current.blur();
                        }
                    }
                    break;
                case "Escape":
                    setIsOpen(false);
                    setSelectedIndex(-1);
                    break;
            }
        };

        // Handle blur
        const handleBlur = () => {
            // Delay closing to allow for suggestion clicks
            setTimeout(() => {
                setIsOpen(false);
                setSelectedIndex(-1);
                onBlur?.();
            }, 150);
        };

        // Close suggestions when clicking outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                    setSelectedIndex(-1);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        return (
            <div ref={containerRef} className={`relative w-full ${className}`}>
                <Input
                    ref={ref}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    name={name}
                    disabled={disabled}
                    className="w-full"
                    autoComplete="off"
                    {...props}
                />

                {isOpen && filteredSuggestions.length > 0 && (
                    <Card className="absolute top-full left-0 right-0 mt-3 max-h-60 overflow-auto z-50 gap-0 p-1">
                        {filteredSuggestions.map((suggestion, index) => (
                            <div
                                key={suggestion}
                                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded-sm transition-colors ${
                                    index === selectedIndex
                                        ? "bg-accent text-accent-foreground"
                                        : "hover:bg-accent/50"
                                }`}
                                onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent blur from firing before click
                                    handleSuggestionSelect(suggestion);
                                }}
                            >
                                <span>{suggestion}</span>
                                {index === selectedIndex && (
                                    <Check className="w-4 h-4" />
                                )}
                            </div>
                        ))}
                    </Card>
                )}
            </div>
        );
    }
);

AutocompleteInput.displayName = "AutocompleteInput";

export { AutocompleteInput };
