import type { JSX } from "react";
import type { Protection } from "@/utils/enums/protection";

export interface Route {
    path: string;
    element: () => JSX.Element;
    protection: Protection;
    allowedRoles?: string[];
}
