
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type RecentReservation = {
    id: number;
    reservation_time: string;
    party_size: number;
    total_amount: string | number;
    deposit_paid: string | number;
    customer?: {
        customer_name: string;
    };
    restaurant_table?: {
        table_number: string | number;
    };
    restaurantTable?: {
        table_number: string | number;
    };
};

type DashboardProps = {
    totalReservations: number;
    totalCustomers: number;
    totalTables: number;
    totalDeposits: number | string;
    recentReservations: RecentReservation[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const formatMoney = (amount: number | string) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(Number(amount ?? 0));

const quickActions = [
    {
        title: 'Reservations',
        description: 'View and manage customer bookings.',
        href: '/reservations',
        icon: '📅',
    },
    {
        title: 'Restaurant Tables',
        description: 'Manage table numbers and capacity.',
        href: '/restaurant-tables',
        icon: '🪑',
    },
    {
        title: 'Menu Items',
        description: 'Manage food items and prices.',
        href: '/menu-items',
        icon: '🍽️',
    },
    {
        title: 'Customers',
        description: 'View registered customer records.',
        href: '/customers',
        icon: '👥',
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
            description: 'All recorded reservations',
            icon: '📅',
            color: 'bg-purple-100 text-purple-700',
        },
        {
            title: 'Total Customers',
            value: totalCustomers,
            description: 'Registered customers',
            icon: '👥',
            color: 'bg-pink-100 text-pink-700',
        },
        {
            title: 'Restaurant Tables',
            value: totalTables,
            description: 'Available registered tables',
            icon: '🪑',
            color: 'bg-violet-100 text-violet-700',
        },
        {
            title: 'Deposits Collected',
            value: formatMoney(totalDeposits),
            description: 'Total recorded deposits',
            icon: '₱',
            color: 'bg-fuchsia-100 text-fuchsia-700',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <main className="min-h-screen space-y-7 bg-slate-50 p-4 md:p-8">

                {/* Welcome Section */}
                <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
                    <div className="grid items-center gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
                        <div>
                            <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700">
                                Restaurant Management System
                            </span>

                            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                                Welcome to Your Restaurant!
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                                Manage reservations, customers, restaurant
                                tables, and menu items all in one place.
                                Make your restaurant operations easier and
                                more organized.
                            </p>

                            <Link
                                href="/reservations/create"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800"
                            >
                                <span className="text-lg">+</span>
                                Create New Reservation
                            </Link>
                        </div>

                        <div className="hidden h-40 w-40 items-center justify-center rounded-3xl bg-purple-50 text-7xl md:flex">
                            🍽️
                        </div>
                    </div>

                    <div className="h-2 bg-gradient-to-r from-purple-600 via-violet-500 to-pink-500" />
                </section>

                {/* Statistics */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-slate-900">
                            Dashboard Overview
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            A quick summary of your restaurant records.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.title}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-500">
                                        {stat.title}
                                    </p>

                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${stat.color}`}
                                    >
                                        {stat.icon}
                                    </div>
                                </div>

                                <p className="mt-4 text-2xl font-extrabold text-slate-900">
                                    {stat.value}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {stat.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-sm md:p-7">
                    <div className="mb-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-purple-300">
                            Management Shortcuts
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Choose a section to manage your restaurant.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group rounded-xl border border-slate-700 bg-slate-800 p-5 transition hover:border-purple-400 hover:bg-slate-700"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl">
                                        {action.icon}
                                    </span>

                                    <span className="text-lg text-purple-300 transition group-hover:translate-x-1">
                                        →
                                    </span>
                                </div>

                                <h3 className="mt-4 font-bold text-white">
                                    {action.title}
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-slate-400">
                                    {action.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Recent Reservations */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center md:px-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Recent Reservations
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your five latest reservation records.
                            </p>
                        </div>

                        <Link
                            href="/reservations"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 transition hover:text-pink-600"
                        >
                            View All Reservations
                            <span>→</span>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-purple-50 text-xs uppercase tracking-wider text-purple-800">
                                <tr>
                                    <th className="px-5 py-4 font-bold">Customer</th>
                                    <th className="px-5 py-4 font-bold">Table</th>
                                    <th className="px-5 py-4 font-bold">Date & Time</th>
                                    <th className="px-5 py-4 font-bold">Party Size</th>
                                    <th className="px-5 py-4 font-bold">Total</th>
                                    <th className="px-5 py-4 font-bold">Deposit</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {recentReservations.length > 0 ? (
                                    recentReservations.map((reservation) => (
                                        <tr
                                            key={reservation.id}
                                            className="transition hover:bg-purple-50/50"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                                                {reservation.customer?.customer_name ?? 'Unknown'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                                {reservation.restaurantTable?.table_number ??
                                                    reservation.restaurant_table?.table_number ??
                                                    'N/A'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                                {new Date(
                                                    reservation.reservation_time
                                                ).toLocaleString('en-PH', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                                {reservation.party_size}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                                                {formatMoney(reservation.total_amount)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-purple-700">
                                                {formatMoney(reservation.deposit_paid)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-14 text-center"
                                        >
                                            <div className="text-4xl">📅</div>

                                            <p className="mt-3 font-bold text-slate-800">
                                                No reservations yet
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Create your first reservation to see it here.
                                            </p>

                                            <Link
                                                href="/reservations/create"
                                                className="mt-4 inline-flex rounded-xl bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800"
                                            >
                                                Create Reservation
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <footer className="py-3 text-center text-xs text-slate-400">
                    Restaurant Reservation &amp; Pre-Order System
                </footer>
            </main>
        </AppLayout>
    );
}
