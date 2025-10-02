import type { ComponentType } from "react";
import type { UserRole } from "@/utils/enums/user";

export interface SidebarItem {
    id: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
    href?: string;
    subItems?: Array<{
        id: string;
        label: string;
        href: string;
        allowedRoles?: UserRole[];
    }>;
    allowedRoles: UserRole[];
}

export interface PaginationMeta {
    hasMore: boolean;
    nextCursor?: string;
    prevCursor?: string;
    total?: number;
}

export interface OffsetPaginationMeta {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}
