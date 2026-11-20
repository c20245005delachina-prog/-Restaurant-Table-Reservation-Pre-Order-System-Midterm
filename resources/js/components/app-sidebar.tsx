import {
    LayoutDashboard,
    CalendarCheck,
    Armchair,
    Utensils,
    Users,
    Store,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';

import { type NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Reservations',
        url: '/reservations',
        icon: CalendarCheck,
    },
    {
        title: 'Restaurant Tables',
        url: '/restaurant-tables',
        icon: Armchair,
    },
    {
        title: 'Menu Items',
        url: '/menu-items',
        icon: Utensils,
    },
    {
        title: 'Customers',
        url: '/customers',
        icon: Users,
    },
];

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="none"
            variant="sidebar"
            className="border-r border-gray-200 bg-white"
        >
            <SidebarHeader className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-white">
                        <Store size={21} />
                    </div>

                    <div>
                        <h1 className="text-base font-extrabold text-slate-900">
                            RTR&POS
                        </h1>
                        <p className="text-[10px] font-bold tracking-wider text-slate-400">
                            RESTAURANT MANAGEMENT
                        </p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-white px-2 pb-4">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-100 bg-white p-3">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
