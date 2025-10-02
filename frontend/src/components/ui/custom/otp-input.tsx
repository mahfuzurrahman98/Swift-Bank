import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

// Custom OTP Input Component
interface OTPInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function OTPInput({ value, onChange, disabled }: OTPInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", ""]);

    // Update internal state when prop value changes
    useEffect(() => {
        if (value) {
            const digits = value.split("").slice(0, 5);
            const newValues = [...digits];
            while (newValues.length < 5) {
                newValues.push("");
            }
            setOtpValues(newValues);
        } else {
            setOtpValues(["", "", "", "", ""]);
        }
    }, [value]);

    const handleInputChange = (index: number, inputValue: string) => {
        // Only allow numeric input and single character
        const sanitized = inputValue.replace(/\D/g, "").slice(0, 1);

        const newValues = [...otpValues];
        newValues[index] = sanitized;
        setOtpValues(newValues);

        // Update parent component
        onChange(newValues.join(""));

        // Auto-focus next input
        if (sanitized && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace") {
            if (!otpValues[index] && index > 0) {
                // If current input is empty, move to previous input
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newValues = [...otpValues];
                newValues[index] = "";
                setOtpValues(newValues);
                onChange(newValues.join(""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 5);

        if (pasteData) {
            const digits = pasteData.split("");
            const newValues = [...digits];
            while (newValues.length < 5) {
                newValues.push("");
            }
            setOtpValues(newValues);
            onChange(newValues.join(""));

            // Focus the next empty input or last input
            const nextIndex = Math.min(digits.length, 4);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    return (
        <div className="flex justify-center space-x-3">
            {otpValues.map((digit, index) => (
                <Input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={disabled}
                    className="w-14 h-14 text-center text-xl font-semibold border-2 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                    maxLength={1}
                />
            ))}
        </div>
    );
}
