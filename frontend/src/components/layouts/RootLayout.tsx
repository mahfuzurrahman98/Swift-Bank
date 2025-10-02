import type { ReactNode } from "react";

export function RootLayout({ children }: { children: ReactNode }) {
    // for now we are not doing anything in the layout
    return <>{children}</>;
}
