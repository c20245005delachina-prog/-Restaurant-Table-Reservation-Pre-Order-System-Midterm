
import { Breadcrumbs } from '@/components/breadcrumbs';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

interface AppSidebarHeaderProps {
    breadcrumbs?: BreadcrumbItemType[];
}

export function AppSidebarHeader({
    breadcrumbs = [],
}: AppSidebarHeaderProps) {
    return (
        <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 md:px-8">
            <div className="flex min-w-0 items-center">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
