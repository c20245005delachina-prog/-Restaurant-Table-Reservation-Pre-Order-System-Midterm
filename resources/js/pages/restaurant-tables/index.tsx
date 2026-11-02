
import { Head, Link } from '@inertiajs/react';

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
}

interface Props {
    tables: PaginatedTables;
}

export default function Index({ tables }: Props) {
    const totalReservations = tables.data.reduce(
        (total, table) => total + (table.reservations_count ?? 0),
        0
    );

    return (
        <>
            <Head title="Restaurant Tables" />

            <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 px-4 py-8 text-slate-800 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
                                Reservation Management
                            </p>

                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                Restaurant Tables
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Manage your restaurant tables and seating capacity.
                            </p>
                        </div>

                        <Link
                            href="/restaurant-tables/create"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-3 font-bold text-white shadow-lg shadow-purple-200 transition duration-300 hover:-translate-y-1 hover:from-purple-700 hover:to-pink-600 hover:shadow-xl"
                        >
                            <span className="text-xl">+</span>
                            Add Table
                        </Link>
                    </header>

                    {/* Summary Cards */}
                    <section className="mb-8 grid gap-5 sm:grid-cols-2">
                        <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Tables on this page
                                    </p>

                                    <p className="mt-3 text-4xl font-extrabold text-purple-700">
                                        {tables.data.length}
                                    </p>
                                </div>

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                                    🪑
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-purple-500">
                                Registered restaurant tables
                            </p>
                        </div>

                        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Reservations on this page
                                    </p>

                                    <p className="mt-3 text-4xl font-extrabold text-pink-600">
                                        {totalReservations}
                                    </p>
                                </div>

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
                                    💗
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-pink-500">
                                Reservations linked to these tables
                            </p>
                        </div>
                    </section>

                    {/* Table List */}
                    <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-md shadow-purple-100/50">
                        <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-5">
                            <h2 className="text-xl font-bold text-slate-800">
                                Table List
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                View your registered restaurant tables and their capacities.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-violet-50 text-xs uppercase tracking-wider text-purple-700">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">
                                            Table Number
                                        </th>
                                        <th className="px-6 py-4 font-bold">
                                            Capacity
                                        </th>
                                        <th className="px-6 py-4 font-bold">
                                            Reservations
                                        </th>
                                        <th className="px-6 py-4 text-right font-bold">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-purple-50">
                                    {tables.data.length > 0 ? (
                                        tables.data.map((table) => (
                                            <tr
                                                key={table.id}
                                                className="transition duration-200 hover:bg-purple-50/70"
                                            >
                                                <td className="whitespace-nowrap px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-700">
                                                            {table.table_number}
                                                        </div>

                                                        <span className="font-semibold text-slate-800">
                                                            Table {table.table_number}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-5">
                                                    <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 font-medium text-violet-700">
                                                        {table.table_capacity}{' '}
                                                        {table.table_capacity === 1
                                                            ? 'seat'
                                                            : 'seats'}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-5">
                                                    <span className="font-semibold text-slate-700">
                                                        {table.reservations_count ?? 0}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-5 text-right">
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
                                                        <span className="h-2 w-2 rounded-full bg-pink-400" />
                                                        Registered
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center">
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
                                                    🪑
                                                </div>

                                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                                    No tables yet
                                                </h3>

                                                <p className="mt-2 text-sm text-slate-500">
                                                    Add your first restaurant table to get started.
                                                </p>

                                                <Link
                                                    href="/restaurant-tables/create"
                                                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white transition hover:bg-purple-700"
                                                >
                                                    + Add Your First Table
                                                </Link>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {tables.links.length > 0 && (
                            <nav
                                aria-label="Table pagination"
                                className="flex flex-wrap items-center justify-between gap-4 border-t border-purple-100 bg-white px-6 py-4"
                            >
                                <p className="text-sm text-slate-500">
                                    {tables.total !== undefined
                                        ? `Total ${tables.total} tables`
                                        : `${tables.data.length} tables on this page`}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {tables.links.map((link, index) => (
                                        <Link
                                            key={`${index}-${link.label}`}
                                            href={link.url ?? '#'}
                                            preserveScroll
                                            aria-disabled={!link.url}
                                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                                                link.active
                                                    ? 'border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-200'
                                                    : link.url
                                                      ? 'border-purple-100 bg-white text-purple-700 hover:border-purple-300 hover:bg-purple-50'
                                                      : 'cursor-not-allowed border-slate-100 text-slate-300'
                                            }`}
                                            onClick={(event) => {
                                                if (!link.url) {
                                                    event.preventDefault();
                                                }
                                            }}
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </nav>
                        )}
                    </section>

                    <footer className="py-8 text-center">
                        <p className="text-sm font-medium text-purple-400">
                            💜 Restaurant Reservation &amp; Pre-Order System
                        </p>
                    </footer>
                </div>
            </main>
        </>
    );
}
