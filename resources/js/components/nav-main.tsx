import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const currentPath = page.url.split('?')[0].replace(/\/$/, '') || '/';

    return (
        <SidebarGroup className="px-2 py-1">

            {/* NAVIGATION LINKS */}
            <SidebarMenu className="gap-2">
                {items.map((item) => {
                    const itemPath = item.url.replace(/\/$/, '') || '/';

                    const isActive =
                        currentPath === itemPath ||
                        (itemPath !== '/dashboard' &&
                            currentPath.startsWith(itemPath + '/'));

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={item.title}
                                className="
                                    h-11 rounded-lg px-3
                                    text-sm font-semibold
                                    text-slate-600
                                    transition-all duration-200

                                    hover:bg-teal-50
                                    hover:text-[#087F78]

                                    data-[active=true]:bg-[#FFC83D]
                                    data-[active=true]:text-slate-900
                                    data-[active=true]:font-bold
                                    data-[active=true]:shadow-sm

                                    data-[active=true]:hover:bg-[#F2B91F]
                                "
                            >
                                <Link
                                    href={item.url}
                                    prefetch
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {item.icon && (
                                        <item.icon
                                            className="mr-2 h-[19px] w-[19px] shrink-0"
                                            strokeWidth={2}
                                        />
                                    )}

                                    <span className="truncate">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
