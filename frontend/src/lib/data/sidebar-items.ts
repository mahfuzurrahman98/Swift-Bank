import { NavigationPaths } from "@/utils/enums/navigation-paths";
import { UserRole } from "@/utils/enums/user";
import { GaugeCircle, ArrowLeftRight, Users, Settings } from "lucide-react";
import type { SidebarItem } from "@/utils/interfaces/common-interfaces";

export const sidebarItems: SidebarItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: GaugeCircle,
        href: NavigationPaths.DASHBOARD,
        allowedRoles: [UserRole.ACCOUNT_HOLDER],
    },
    {
        id: "transactions",
        label: "Transactions",
        icon: ArrowLeftRight,
        href: NavigationPaths.TRANSACTIONS,
        allowedRoles: [UserRole.ACCOUNT_HOLDER],
    },
    {
        id: "beneficiaries",
        label: "Beneficiaries",
        icon: Users,
        href: NavigationPaths.BENEFICIARIES,
        allowedRoles: [UserRole.ACCOUNT_HOLDER],
    },
];

export const settingItem = {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: NavigationPaths.SETTINGS,
};
