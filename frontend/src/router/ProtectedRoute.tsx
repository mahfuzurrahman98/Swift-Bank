import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { Protection } from "@/utils/enums/protection";
import { NavigationPaths } from "@/utils/enums/navigation-paths";
import { logger } from "@/utils/helpers/logger";

export const ProtectedRoute = ({
    protection,
    allowedRoles,
}: {
    protection: Protection;
    allowedRoles?: string[];
}) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    switch (protection) {
        case Protection.PRIVATE:
            // Route is only accessible to authenticated users
            if (!isAuthenticated) {
                // If user is not logged in, redirect to login page
                return (
                    <Navigate
                        to={NavigationPaths.AUTH_SIGNIN}
                        state={{ from: location }}
                        replace
                    />
                );
            }

            // Check if user has the required role
            const currentUserRole = user?.role;

            logger.info("🔐 Role Check Debug:", {
                currentPath: location.pathname,
                currentUserRole,
                allowedRoles,
                hasAllowedRoles: !!allowedRoles,
                hasCurrentRole: !!currentUserRole,
                isRoleAllowed: allowedRoles
                    ? allowedRoles.includes(currentUserRole || "")
                    : true,
            });

            if (
                allowedRoles &&
                currentUserRole &&
                !allowedRoles.includes(currentUserRole)
            ) {
                // User doesn't have the required role, redirect to dashboard
                return <Navigate to={NavigationPaths.DASHBOARD} replace />;
            }

            // User is authenticated and has the required role, allow access
            break;

        case Protection.GUEST_ONLY:
            // Route is only accessible to non-authenticated users
            if (isAuthenticated) {
                // If user is logged in, redirect to dashboard
                return <Navigate to={NavigationPaths.DASHBOARD} replace />;
            }
            break;

        case Protection.PUBLIC:
            // Public routes are accessible to everyone, no checks needed
            break;

        default:
            console.warn(`Unknown protection type: ${protection}`);
            break;
    }

    return <Outlet />;
};
