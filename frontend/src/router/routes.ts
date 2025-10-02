import { UserRole } from "@/utils/enums/user";
import { Protection } from "@/utils/enums/protection";
import { NavigationPaths } from "@/utils/enums/navigation-paths";
import type { Route } from "@/utils/interfaces/route-interfaces";

// Landing Page
import Page from "@/pages/Page";

// Auth Pages
import SigninPage from "@/pages/auth/SigninPage";
import MagicLinkVerifyPage from "@/pages/auth/MagicLinkVerifyPage";

// Banking Pages
import BankingDashboardPage from "@/pages/banking/BankingDashboardPage";
import TransactionsPage from "@/pages/banking/TransactionsPage";
import BeneficiariesPage from "@/pages/banking/BeneficiariesPage";

// Test Pages
import TestPage from "@/pages/TestPage";

const routes: Route[] = [
    // --------------- Landing route ---------------
    {
        path: NavigationPaths.LANDING,
        element: Page,
        protection: Protection.PUBLIC,
        allowedRoles: [UserRole.GUEST],
    },

    // --------------- Auth routes ---------------
    {
        path: NavigationPaths.AUTH_SIGNIN,
        element: SigninPage,
        protection: Protection.GUEST_ONLY,
        allowedRoles: [UserRole.GUEST],
    },
    {
        path: `${NavigationPaths.AUTH_VERIFY_MAGIC_LINK}/:token`,
        element: MagicLinkVerifyPage,
        protection: Protection.GUEST_ONLY,
        allowedRoles: [UserRole.GUEST],
    },

    // --------------- Banking routes ---------------
    {
        path: NavigationPaths.DASHBOARD,
        element: BankingDashboardPage,
        protection: Protection.PRIVATE,
        allowedRoles: [UserRole.ACCOUNT_HOLDER],
    },

    {
        path: NavigationPaths.TRANSACTIONS,
        element: TransactionsPage,
        protection: Protection.PRIVATE,
        allowedRoles: [UserRole.ACCOUNT_HOLDER],
    },

    {
        path: NavigationPaths.BENEFICIARIES,
        element: BeneficiariesPage,
        protection: Protection.PRIVATE,
        allowedRoles: [UserRole.ACCOUNT_HOLDER],
    },

    // --------------- Test routes ---------------
    {
        path: NavigationPaths.TEST,
        element: TestPage,
        protection: Protection.PUBLIC,
        allowedRoles: [UserRole.GUEST],
    },
];

export default routes;
