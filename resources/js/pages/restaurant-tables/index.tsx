
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';

interface RestaurantTable {
    id: number;
    table_number: string | number;
    table_capacity: number;
    reservations_count?: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTables {
    data: RestaurantTable[];
    links: PaginationLink[];
    total?: number;
    current_page?: number;
    last_page?: number;
    per_page?: number;
}

interface Props {
    tables: PaginatedTables;
}

function paginationLabel(label: string) {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&')
        .replace(/<[^>]*>/g, '')
        .trim();
}

export default function Index({ tables }: Props) {
    const totalReservations = tables.data.reduce(
        (total, table) => total + (table.reservations_count ?? 0),
        0,
    );

    const currentPage = tables.current_page ?? 1;
    const lastPage = tables.last_page ?? 1;
    const totalTables = tables.total ?? tables.data.length;

    const perPage = tables.per_page ?? 10;

    const startNumber =
        totalTables === 0 ? 0 : (currentPage - 1) * perPage + 1;

    const endNumber = Math.min(currentPage * perPage, totalTables);

    return (
        <AppLayout>
            <Head title="Restaurant Tables" />

            <main className="min-h-screen bg-gray-100 px-4 py-8 text-gray-900 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-7xl">

                    {/* PAGE HEADER */}
                    <header className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <Link
                                href="/dashboard"
                                className="mb-4 inline-flex items-center text-sm font-semibold text-teal-700 transition hover:text-teal-900"
                            >
                                 Back to Dashboard
                            </Link>

                            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                                Restaurant Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                                Restaurant Tables
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Manage your restaurant tables and seating capacity.
                            </p>
                        </div>

                        <Link
                            href="/restaurant-tables/create"
                            className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                            + Add Table
                        </Link>
                    </header>

                    {/* SUMMARY CARDS */}
                    <section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

                        {/* TOTAL TABLES */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Restaurant Tables
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-teal-800">
                                        {totalTables}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Registered restaurant tables
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                                    🪑
                                </div>
                            </div>
                        </div>

                        {/* RESERVATIONS */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Reservations on This Page
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-gray-950">
                                        {totalReservations}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Reservations linked to displayed tables
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                                    📋
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* TABLE LIST */}
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                        {/* CARD HEADER */}
                        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:p-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Registered Restaurant Tables
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    View your registered tables and their seating capacities.
                                </p>
                            </div>

                            <p className="text-sm text-gray-500">
                                Showing{' '}
                                <span className="font-semibold text-gray-900">
                                    {startNumber}–{endNumber}
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold text-gray-900">
                                    {totalTables}
                                </span>{' '}
                                tables
                            </p>
                        </div>

                        {/* RESPONSIVE TABLE */}
                        <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-[650px] text-left text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        <th className="px-5 py-4">
                                            Table Number
                                        </th>

                                        <th className="px-5 py-4">
                                            Seating Capacity
                                        </th>

                                        <th className="px-5 py-4">
                                            Reservations
                                        </th>

                                        <th className="px-5 py-4 text-right">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {tables.data.length > 0 ? (
                                        tables.data.map((table) => (
                                            <tr
                                                key={table.id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                {/* TABLE NUMBER */}
                                                <td className="whitespace-nowrap px-5 py-5">
                                                    <span className="font-semibold text-gray-900">
                                                        Table {table.table_number}
                                                    </span>
                                                </td>

                                                {/* CAPACITY */}
                                                <td className="whitespace-nowrap px-5 py-5">
                                                    <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                                                        {table.table_capacity}{' '}
                                                        {table.table_capacity === 1
                                                            ? 'seat'
                                                            : 'seats'}
                                                    </span>
                                                </td>

                                                {/* RESERVATIONS */}
                                                <td className="whitespace-nowrap px-5 py-5 font-semibold text-gray-800">
                                                    {table.reservations_count ?? 0}
                                                </td>

                                                {/* STATUS */}
                                                <td className="whitespace-nowrap px-5 py-5 text-right">
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                        <span className="h-2 w-2 rounded-full bg-green-500" />
                                                        Registered
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-5 py-14 text-center"
                                            >
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-3xl">
                                                    🪑
                                                </div>

                                                <h3 className="mt-4 font-bold text-gray-900">
                                                    No restaurant tables yet
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Add your first restaurant table to get started.
                                                </p>

                                                <Link
                                                    href="/restaurant-tables/create"
                                                    className="mt-5 inline-flex rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                                                >
                                                    + Add Your First Table
                                                </Link>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        {tables.links.length > 0 && lastPage > 1 && (
                            <nav
                                aria-label="Restaurant table pagination"
                                className="flex flex-col justify-between gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center"
                            >
                                <p className="text-sm text-gray-500">
                                    Page {currentPage} of {lastPage}
                                </p>

                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    {tables.links.map((link, index) => (
                                        <button
                                            key={`${index}-${link.label}`}
                                            type="button"
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.visit(link.url, {
                                                        preserveScroll: true,
                                                        preserveState: true,
                                                    });
                                                }
                                            }}
                                            className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                                                link.active
                                                    ? 'border-teal-700 bg-teal-700 text-white'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-yellow-400 hover:bg-yellow-50'
                                            } disabled:cursor-not-allowed disabled:opacity-40`}
                                        >
                                            {paginationLabel(link.label)}
                                        </button>
                                    ))}
                                </div>
                            </nav>
                        )}
                    </section>

                    {/* FOOTER */}
                    <footer className="mt-6 pb-4 text-center text-xs text-gray-400">
                        Restaurant Table Reservation &amp; Pre-Order System © 2026
                    </footer>
                </div>
            </main>
        </AppLayout>
    );
}
