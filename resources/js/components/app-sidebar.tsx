import {
    LayoutDashboard,
    CalendarCheck,
    Armchair,
    Utensils,
    Users,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';

import AppLogo from '@/components/app-logo';
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
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <AppLogo />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}