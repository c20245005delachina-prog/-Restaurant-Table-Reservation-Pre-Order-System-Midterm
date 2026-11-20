
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';

interface AppSidebarLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppSidebarLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />

            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />

                <main className="min-w-0 flex-1 bg-gray-50">
                    {children}
                </main>
            </AppContent>
        </AppShell>
    );
}
