import { useEffect, useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarFooter,
    useSidebar,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChevronDown, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggleSm } from "@/components/ui/custom/mode-toggle-sm";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { AuthService } from "@/services/auth-services";
import { NavigationPaths } from "@/utils/enums/navigation-paths";
import { limitString } from "@/utils/helpers";
import { logger } from "@/utils/helpers/logger";
import { settingItem, sidebarItems } from "@/lib/data/sidebar-items";
import type { SidebarItem } from "@/utils/interfaces/common-interfaces";

export function AdminSidebar() {
    const [isLoading] = useState(false);

    const pathname = useLocation().pathname;
    const navigate = useNavigate();

    const { user, setUser, setAccessToken } = useAuthStore();

    // For now, show all sidebar items since we don't have roles implemented
    const allowedSidebarItems = sidebarItems;

    // name to show in sidebar bottom
    let userName = "Guest";
    let userEmail = "";
    if (user) {
        userName = user.name || "User";
        userEmail = user.email;
    }

    const handleSignout = async () => {
        try {
            await AuthService.signout();
            setUser(null);
            setAccessToken(null);
            toast.success("Logout successfully");
        } catch (error: any) {
            logger.error("Logout error:", error);
        } finally {
            navigate(NavigationPaths.AUTH_SIGNIN);
        }
    };

    const { isMobile, setOpenMobile, state } = useSidebar();

    useEffect(() => {
        setOpenMobile(false);
    }, [pathname, setOpenMobile]);

    // Check if any subitem is active to determine if parent should be expanded
    const isParentActive = (item: SidebarItem) => {
        if (item.href && pathname === item.href) {
            return true;
        }
        if (item.subItems) {
            return item.subItems.some((subItem) => pathname === subItem.href);
        }
        return false;
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="pt-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center justify-between w-full">
                                    <div
                                        className={cn(
                                            state == "collapsed"
                                                ? "flex justify-center items-center"
                                                : "px-3",
                                            ""
                                        )}
                                    >
                                        {state == "expanded" && (
                                            <div className="w-[170px] h-auto">
                                                <p className="font-bold text-2xl">
                                                    💰 Swift Bank
                                                </p>
                                            </div>
                                        )}
                                        {state == "collapsed" && !isMobile && (
                                            <div className="flex justify-center">
                                                <p className="font-bold text-2xl">
                                                    💰
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        {state === "expanded" && (
                                            <SidebarTrigger className="border w-8 h-8" />
                                        )}
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="pt-3">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {allowedSidebarItems.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    {item.href && !item.subItems ? (
                                        // Regular menu item with direct link
                                        <SidebarMenuButton
                                            className="text-base px-4 py-5 relative"
                                            asChild
                                            isActive={pathname === item.href}
                                        >
                                            <Link
                                                to={item.href}
                                                className="flex items-center gap-2 relative"
                                            >
                                                <item.icon className="shrink-0 size-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    ) : item.subItems ? (
                                        // Collapsible menu with subitems
                                        <Collapsible
                                            defaultOpen={isParentActive(item)}
                                            className="group/collapsible"
                                        >
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    className="text-base px-4 py-5"
                                                    isActive={isParentActive(
                                                        item
                                                    )}
                                                >
                                                    <item.icon className="shrink-0 size-4" />
                                                    <span>{item.label}</span>
                                                    <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.subItems.map(
                                                        (subItem) => (
                                                            <SidebarMenuSubItem
                                                                key={subItem.id}
                                                            >
                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                    isActive={
                                                                        pathname ===
                                                                        subItem.href
                                                                    }
                                                                >
                                                                    <Link
                                                                        to={
                                                                            subItem.href
                                                                        }
                                                                    >
                                                                        {
                                                                            subItem.label
                                                                        }
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        )
                                                    )}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : null}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarMenu>
                <SidebarMenuItem className="mb-2 px-2">
                    <SidebarMenuButton
                        className="text-base px-4 py-5"
                        asChild
                        isActive={pathname.startsWith(settingItem.href)}
                    >
                        <Link
                            to={`${settingItem.href}`}
                            className="text-base flex items-center gap-2"
                        >
                            <settingItem.icon />
                            <span>{settingItem.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>

            {state == "collapsed" && (
                <SidebarMenuItem className="hidden md:block md:mb-2 px-2">
                    <SidebarTrigger className="w-8 h-8" />
                </SidebarMenuItem>
            )}

            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size="lg">
                                        <Avatar className="size-8">
                                            <AvatarImage src={""} />
                                            <AvatarFallback>
                                                {userName[0]?.toUpperCase() ||
                                                    "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-0.5 leading-none">
                                            <span className="font-medium">
                                                {limitString(userName, 20)}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {userEmail
                                                    ? limitString(userEmail, 22)
                                                    : "Not signed in"}
                                            </span>
                                        </div>
                                        <ChevronDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    className="w-[--radix-dropdown-menu-trigger-width]"
                                >
                                    <DropdownMenuItem>
                                        <ModeToggleSm />
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={handleSignout}
                                    >
                                        <LogOut className="mr-2 size-4" />
                                        <span>Sign out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
