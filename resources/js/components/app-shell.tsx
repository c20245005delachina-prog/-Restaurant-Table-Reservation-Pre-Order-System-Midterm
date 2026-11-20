import { SidebarProvider } from '@/components/ui/sidebar';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({
    children,
    variant = 'header',
}: AppShellProps) {
    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col bg-[#E8EFEB]">
                {children}
            </div>
        );
    }

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full bg-[#E8EFEB]">
                {children}
            </div>
        </SidebarProvider>
    );
}
