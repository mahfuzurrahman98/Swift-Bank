import { ModeToggle } from "@/components/ui/custom/mode-toggle";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

interface AuthLayoutProps {
    children?: ReactNode;
    className?: string;
    showLogo?: boolean;
}

export function AuthLayout({
    children,
    className,
    showLogo = true,
}: AuthLayoutProps) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="min-h-screen flex flex-col">
                <header className="py-4 px-6 flex justify-between items-center">
                    {showLogo && (
                        <div className="font-bold text-3xl">
                            💰 {import.meta.env.VITE_APP_NAME}
                        </div>
                    )}
                    <div className="ml-auto">
                        <ModeToggle />
                    </div>
                </header>
                <main
                    className={cn(
                        "flex-1 flex items-center justify-center p-4 md:p-6",
                        className
                    )}
                >
                    <div className="w-full max-w-md">
                        {children || <Outlet />}
                    </div>
                </main>
                <footer className="py-4 px-6 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}
                    . All rights reserved.
                </footer>
            </div>

            <Toaster duration={7000} closeButton richColors />
        </ThemeProvider>
    );
}
