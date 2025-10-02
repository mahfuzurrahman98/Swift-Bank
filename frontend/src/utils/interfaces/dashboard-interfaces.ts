import type { JSX } from "react";

export interface DashboardData {
    completedProjects: number;
    activeEmployees: number;
    pendingReceivedInvitations: number;
    totalClients: number;
    totalSuppliers: number;
}

export interface StatsCard {
    title: string;
    value: number;
    icon: JSX.Element;
    description: string;
    trend?: string;
}
