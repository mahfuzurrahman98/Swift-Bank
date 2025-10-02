import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminSidebar } from "@/components/layouts/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/layouts/admin/AdminHeader";
import { AlertMessage } from "@/components/ui/custom/alert-message";
import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";

interface AdminLayoutProps {
    children?: ReactNode;
    error?: string | null;
}

export function AdminLayout({ children, error }: AdminLayoutProps) {
    const [showError, setShowError] = useState(false);

    // Show error alert when error prop changes
    useEffect(() => {
        if (error) {
            setShowError(true);
        }
    }, [error]);

    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <SidebarProvider>
                    <div className="flex w-full h-screen">
                        {/* Sidebar */}
                        <AdminSidebar />

                        {/* Main Content */}
                        <div className="flex flex-col flex-1">
                            {/* Header */}
                            <AdminHeader />

                            {/* Main Content Area */}
                            <main className="flex-1 p-4">
                                {children || <Outlet />}
                                {/* Error Alert */}
                                {showError && error && (
                                    <div className="max-w-7xl w-full mt-4">
                                        <AlertMessage
                                            message={error}
                                            type="error"
                                        />
                                    </div>
                                )}
                            </main>
                        </div>
                    </div>
                </SidebarProvider>
            </ThemeProvider>

            <Toaster duration={7000} closeButton richColors />
        </>
    );
}
