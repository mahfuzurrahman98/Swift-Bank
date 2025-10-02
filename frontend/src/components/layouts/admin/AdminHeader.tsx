import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminHeader() {
    return (
        <header className="flex md:hidden items-center justify-between px-5 py-4 border-b shadow-sm">
            <div className="flex justify-end items-center">
                <SidebarTrigger className="hidden md:block border w-8 h-8 md:w-6 md:h-6" />

                <div className="w-[170px] h-auto">
                    <p className="font-bold text-3xl">Swift Bank</p>
                </div>
            </div>
        </header>
    );
}
