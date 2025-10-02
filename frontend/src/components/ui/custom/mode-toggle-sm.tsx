import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

export function ModeToggleSm() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // Set mounted to true after the component is mounted
    }, []);

    const btnCommonClasses = "cursor-pointer rounded-full p-2 transition";

    if (!mounted) return null; // Render nothing until the component is mounted

    return (
        <div className="flex items-center border-2 rounded-full p-1 gap-1 bg-background">
            {/* Light Mode */}
            <button
                onClick={() => setTheme("light")}
                className={`${btnCommonClasses} ${
                    theme === "light" ? "bg-foreground" : ""
                }`}
                aria-label="Light Mode"
            >
                <Sun className="text-background dark:text-foreground size-4" />
            </button>

            {/* System Mode */}
            <button
                onClick={() => setTheme("system")}
                className={`${btnCommonClasses} ${
                    theme === "system" ? "bg-foreground" : ""
                }`}
                aria-label="System Mode"
            >
                <Laptop
                    className={`size-4 ${
                        theme === "system"
                            ? "text-background"
                            : "text-foreground dark:text-foreground"
                    }`}
                />
            </button>

            {/* Dark Mode */}
            <button
                onClick={() => setTheme("dark")}
                className={`${btnCommonClasses} ${
                    theme === "dark" ? "bg-foreground" : ""
                }`}
                aria-label="Dark Mode"
            >
                <Moon
                    className={`size-4 ${
                        theme === "dark"
                            ? "text-background"
                            : "text-foreground dark:text-foreground"
                    }`}
                />
            </button>
        </div>
    );
}
