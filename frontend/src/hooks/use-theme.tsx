"use client";

import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export const useSystemTheme = () => {
    const { theme } = useTheme();
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
        "light"
    );

    useEffect(() => {
        // Resolve the theme on mount
        const systemTheme =
            theme === "system"
                ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : (theme as "light" | "dark"); // Explicit cast to "light" | "dark" theme
        setResolvedTheme(systemTheme);
    }, [theme]);

    return resolvedTheme;
};
