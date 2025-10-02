import routes from "@/router/routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Error } from "@/components/Error";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { PersistSessionComponent } from "@/components/auth/PersistSessionComponent";
import { AuthLayout } from "@/components/layouts/auth/AuthLayout";
import { AdminLayout } from "@/components/layouts/admin/AdminLayout";
import { NavigationPaths } from "@/utils/enums/navigation-paths";
import type { Route as IRoute } from "@/utils/interfaces/route-interfaces";

export const Router = () => {
    // Routes that should use AuthLayout
    const authLayoutRoutes = [
        NavigationPaths.AUTH_SIGNIN,
        `${NavigationPaths.AUTH_VERIFY_MAGIC_LINK}/:token`,
    ];

    // Routes that should use AdminLayout
    const adminLayoutRoutes = [
        NavigationPaths.DASHBOARD,

        NavigationPaths.TRANSACTIONS,
        NavigationPaths.BENEFICIARIES,

        NavigationPaths.SETTINGS,
        NavigationPaths.SETTINGS_RESET_PASSWORD,
    ];

    // Separate routes into different layout categories
    const authRoutes = routes.filter((route: IRoute) =>
        authLayoutRoutes.includes(route.path as NavigationPaths)
    );
    const adminRoutes = routes.filter((route: IRoute) =>
        adminLayoutRoutes.includes(route.path as NavigationPaths)
    );
    const regularRoutes = routes.filter(
        (route: IRoute) =>
            !authLayoutRoutes.includes(route.path as NavigationPaths) &&
            !adminLayoutRoutes.includes(route.path as NavigationPaths)
    );

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PersistSessionComponent key={-1} />}>
                    {/* Auth Layout Routes - AuthLayout renders once for all these routes */}
                    <Route element={<AuthLayout />}>
                        {authRoutes.map((route: IRoute, key: number) => (
                            <Route
                                key={`auth-${key}`}
                                element={
                                    <ProtectedRoute
                                        protection={route.protection}
                                        allowedRoles={route.allowedRoles}
                                    />
                                }
                            >
                                <Route
                                    path={route.path}
                                    element={<route.element />}
                                />
                            </Route>
                        ))}
                    </Route>

                    {/* Admin Layout Routes - AdminLayout renders once for all these routes */}
                    <Route element={<AdminLayout />}>
                        {adminRoutes.map((route: IRoute, key: number) => (
                            <Route
                                key={`admin-${key}`}
                                element={
                                    <ProtectedRoute
                                        protection={route.protection}
                                        allowedRoles={route.allowedRoles}
                                    />
                                }
                            >
                                <Route
                                    path={route.path}
                                    element={<route.element />}
                                />
                            </Route>
                        ))}
                    </Route>

                    {/* Regular Routes - No layout wrapper */}
                    {regularRoutes.map((route: IRoute, key: number) => (
                        <Route
                            key={`regular-${key}`}
                            path={route.path}
                            element={<route.element />}
                        />
                    ))}
                </Route>

                {/* Not Found Route */}
                <Route path="*" element={<Error code={404} />} />
            </Routes>
        </BrowserRouter>
    );
};
