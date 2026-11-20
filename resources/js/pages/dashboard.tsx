import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    Users,
    Armchair,
    Wallet,
    Plus,
    ArrowRight,
    Utensils,
    ClipboardList,
    Eye,
    LayoutDashboard,
    Clock,
    ChevronRight,
} from 'lucide-react';

interface RecentReservation {
    id: number;
    reservation_time: string;
    party_size: number;
    total_amount: string | number;
    deposit_paid: string | number;
    customer?: {
        customer_name: string;
    };
    restaurantTable?: {
        table_number: string | number;
    };
    restaurant_table?: {
        table_number: string | number;
    };
}

interface DashboardProps {
    totalReservations: number;
    totalCustomers: number;
    totalTables: number;
    totalDeposits: number | string;
    recentReservations: RecentReservation[];
}

const formatMoney = (amount: number | string) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(Number(amount ?? 0));

const formatDate = (date: string) => {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return 'Invalid date';
    }

    return value.toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

const managementItems = [
    {
        title: 'Reservations',
        description: 'Manage bookings and pre-orders.',
        href: '/reservations',
        icon: CalendarDays,
        color: 'bg-teal-50 text-teal-700',
    },
    {
        title: 'Restaurant Tables',
        description: 'Manage table numbers and capacity.',
        href: '/restaurant-tables',
        icon: Armchair,
        color: 'bg-amber-50 text-amber-700',
    },
    {
        title: 'Menu Items',
        description: 'Manage dishes, categories and prices.',
        href: '/menu-items',
        icon: Utensils,
        color: 'bg-orange-50 text-orange-700',
    },
    {
        title: 'Customers',
        description: 'View and manage customer records.',
        href: '/customers',
        icon: Users,
        color: 'bg-blue-50 text-blue-700',
    },
];

export default function Dashboard({
    totalReservations,
    totalCustomers,
    totalTables,
    totalDeposits,
    recentReservations,
}: DashboardProps) {
    const stats = [
        {
            title: 'Total Reservations',
            value: totalReservations,
            description: 'All recorded bookings',
            icon: CalendarDays,
            href: '/reservations',
            color: 'bg-teal-50 text-teal-700',
            accent: 'border-t-teal-600',
        },
        {
            title: 'Total Customers',
            value: totalCustomers,
            description: 'Registered customers',
            icon: Users,
            href: '/customers',
            color: 'bg-blue-50 text-blue-700',
            accent: 'border-t-blue-500',
        },
        {
            title: 'Restaurant Tables',
            value: totalTables,
            description: 'Registered tables',
            icon: Armchair,
            href: '/restaurant-tables',
            color: 'bg-amber-50 text-amber-700',
            accent: 'border-t-amber-500',
        },
        {
            title: 'Deposits Collected',
            value: formatMoney(totalDeposits),
            description: 'Total recorded deposits',
            icon: Wallet,
            href: null,
            color: 'bg-emerald-50 text-emerald-700',
            accent: 'border-t-emerald-500',
        },
    ];

    return (
        <AppLayout>
            <Head title="Restaurant Dashboard" />

            <div className="min-h-screen space-y-6 bg-[#F5F7F6] px-4 pt-3 pb-4 md:px-6 md:pt-4 md:pb-6 lg:px-8 lg:pt-5 lg:pb-8">

                {/* PAGE HEADER */}
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <LayoutDashboard size={16} />
                            <span>Restaurant Management</span>
                            <ChevronRight size={14} />
                            <span className="font-semibold text-teal-700">
                                Dashboard
                            </span>
                        </div>

                        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                            Dashboard Overview
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Welcome back! Here's your restaurant's activity.
                        </p>
                    </div>

                    <Link
                        href="/reservations/create"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFC83D] px-5 py-3 text-sm font-bold text-slate-900"
                    >
                        <Plus size={18} />
                        Create New Reservation
                    </Link>
                </section>

                {/* WELCOME BANNER */}
                <section className="relative overflow-hidden rounded-xl bg-[#087F78] p-6 text-white md:p-8">
                    <div className="relative z-10 max-w-2xl">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-100">
                            Restaurant Management System
                        </span>

                        <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">
                            Manage Your Restaurant Smarter!
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-teal-50">
                            Handle table reservations, customer information,
                            food pre-orders, and restaurant records in one
                            convenient platform.
                        </p>

                        <Link
                            href="/reservations"
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-teal-800"
                        >
                            View Reservations
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className="absolute -right-12 -top-16 hidden h-64 w-64 rounded-full border-[35px] border-white/10 md:block" />

                    <div className="absolute -bottom-20 right-32 hidden h-48 w-48 rounded-full bg-white/5 md:block" />

                    <Utensils
                        size={110}
                        className="absolute bottom-5 right-12 hidden text-white/10 lg:block"
                    />
                </section>

                {/* STATISTICS */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-extrabold text-slate-900">
                            Restaurant Statistics
                        </h2>
                        <p className="text-sm text-slate-500">
                            Overview of your restaurant records.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            const content = (
                                <div
                                    className={`h-full rounded-xl border border-slate-200 border-t-4 ${stat.accent} bg-white p-5 shadow-sm`}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-slate-500">
                                            {stat.title}
                                        </p>

                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.color}`}
                                        >
                                            <Icon size={22} />
                                        </div>
                                    </div>

                                    <h3 className="mt-5 text-2xl font-extrabold text-slate-900">
                                        {stat.value}
                                    </h3>

                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="text-xs text-slate-400">
                                            {stat.description}
                                        </p>

                                        {stat.href && (
                                            <ArrowRight
                                                size={16}
                                                className="text-teal-700"
                                            />
                                        )}
                                    </div>
                                </div>
                            );

                            return stat.href ? (
                                <Link key={stat.title} href={stat.href}>
                                    {content}
                                </Link>
                            ) : (
                                <div key={stat.title}>
                                    {content}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* QUICK MANAGEMENT */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-extrabold text-slate-900">
                            Quick Management
                        </h2>

                        <p className="text-sm text-slate-500">
                            Select a section to manage your restaurant.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {managementItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                                    >
                                        <Icon size={23} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-slate-800">
                                            {item.title}
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {item.description}
                                        </p>
                                    </div>

                                    <ArrowRight
                                        size={18}
                                        className="shrink-0 text-slate-400"
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* RECENT RESERVATIONS */}
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <ClipboardList
                                    size={21}
                                    className="text-teal-700"
                                />

                                <h2 className="text-lg font-extrabold text-slate-900">
                                    Recent Reservations
                                </h2>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Latest customer bookings and pre-orders.
                            </p>
                        </div>

                        <Link
                            href="/reservations"
                            className="inline-flex items-center gap-2 text-sm font-bold text-teal-700"
                        >
                            View All Reservations
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-sm">
                            <thead className="bg-[#F0F7F5] text-xs uppercase tracking-wide text-slate-600">
                                <tr>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Table</th>
                                    <th className="px-5 py-4">Date & Time</th>
                                    <th className="px-5 py-4">Guests</th>
                                    <th className="px-5 py-4">Total</th>
                                    <th className="px-5 py-4">Deposit</th>
                                    <th className="px-5 py-4 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {recentReservations.length > 0 ? (
                                    recentReservations.map((reservation) => (
                                        <tr
                                            key={reservation.id}
                                            className="text-slate-600"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                                                {reservation.customer?.customer_name ?? 'Unknown'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                Table{' '}
                                                {reservation.restaurantTable?.table_number ??
                                                    reservation.restaurant_table?.table_number ??
                                                    'N/A'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock
                                                        size={15}
                                                        className="text-slate-400"
                                                    />
                                                    {formatDate(reservation.reservation_time)}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                {reservation.party_size}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                                                {formatMoney(reservation.total_amount)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 font-bold text-teal-700">
                                                {formatMoney(reservation.deposit_paid)}
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <Link
                                                    href={`/reservations/${reservation.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 px-3 py-2 text-xs font-bold text-teal-700"
                                                >
                                                    <Eye size={15} />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-14 text-center"
                                        >
                                            <CalendarDays
                                                size={40}
                                                className="mx-auto text-slate-300"
                                            />

                                            <p className="mt-3 font-bold text-slate-800">
                                                No reservations yet
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                New reservations will appear here.
                                            </p>

                                            <Link
                                                href="/reservations/create"
                                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FFC83D] px-4 py-2.5 text-sm font-bold text-slate-900"
                                            >
                                                <Plus size={16} />
                                                Create Reservation
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-4 text-xs text-slate-400 sm:flex-row">
                    <p>
                        Restaurant Table Reservation & Pre-Order System
                    </p>
                    <p>© 2026 All Rights Reserved</p>
                </footer>
            </div>
        </AppLayout>
    );
}
