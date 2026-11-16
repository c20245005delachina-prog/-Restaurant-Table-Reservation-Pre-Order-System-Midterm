
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

            <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <Link
                                href="/dashboard"
                                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 transition hover:text-pink-600"
                            >
                                ← Back to Dashboard
                            </Link>

                            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-purple-600">
                                Reservation Management
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Restaurant Tables
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Manage your restaurant tables and seating capacity.
                            </p>
                        </div>

                        <Link
                            href="/restaurant-tables/create"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-purple-700"
                        >
                            <span className="text-xl">+</span>
                            Add Table
                        </Link>
                    </header>

                    <section className="mb-8 grid gap-5 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">
                                Tables on this page
                            </p>
                            <p className="mt-3 text-4xl font-bold text-purple-700">
                                {tables.data.length}
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                                Registered restaurant tables
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">
                                Reservations on this page
                            </p>
                            <p className="mt-3 text-4xl font-bold text-pink-600">
                                {totalReservations}
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                                Reservations linked to these tables
                            </p>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h2 className="text-lg font-bold text-slate-800">
                                Table List
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                View your registered tables and their capacities.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-purple-50 text-xs uppercase tracking-wider text-purple-700">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Table Number</th>
                                        <th className="px-6 py-4 font-bold">Capacity</th>
                                        <th className="px-6 py-4 font-bold">Reservations</th>
                                        <th className="px-6 py-4 text-right font-bold">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {tables.data.length > 0 ? (
                                        tables.data.map((table) => (
                                            <tr
                                                key={table.id}
                                                className="transition hover:bg-purple-50/50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-5">
                                                    <span className="font-semibold text-slate-800">
                                                        Table {table.table_number}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-5">
                                                    <span className="rounded-full bg-violet-100 px-3 py-1 font-medium text-violet-700">
                                                        {table.table_capacity}{' '}
                                                        {table.table_capacity === 1 ? 'seat' : 'seats'}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-5 font-semibold text-slate-700">
                                                    {table.reservations_count ?? 0}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-5 text-right">
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                        <span className="h-2 w-2 rounded-full bg-green-500" />
                                                        Registered
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center">
                                                <div className="text-4xl">🪑</div>
                                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                                    No tables yet
                                                </h3>
                                                <p className="mt-2 text-sm text-slate-500">
                                                    Add your first restaurant table to get started.
                                                </p>
                                                <Link
                                                    href="/restaurant-tables/create"
                                                    className="mt-5 inline-flex rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white transition hover:bg-purple-700"
                                                >
                                                    + Add Your First Table
                                                </Link>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {tables.links.length > 0 && (
                            <nav
                                aria-label="Table pagination"
                                className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-4"
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
                                            onClick={(event) => {
                                                if (!link.url) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                                                link.active
                                                    ? 'border-purple-600 bg-purple-600 text-white'
                                                    : link.url
                                                      ? 'border-slate-200 bg-white text-purple-700 hover:bg-purple-50'
                                                      : 'cursor-not-allowed border-slate-100 text-slate-300'
                                            }`}
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

                    <footer className="py-8 text-center text-sm text-slate-400">
                        Restaurant Reservation &amp; Pre-Order System
                    </footer>
                </div>
            </main>
        </>
    );
}
