import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface Customer {
    id: number;
    customer_name: string;
    contact_number: string;
}

interface RestaurantTable {
    id: number;
    table_number: string | number;
    table_capacity: number;
}

interface MenuItem {
    id: number;
    name: string;
    category?: string;
    price: number | string;
}

interface ReservationItem {
    id: number;
    quantity: number;
    unit_price: number | string;
    menu_item?: MenuItem;
}

interface Reservation {
    id: number;
    reservation_time: string;
    party_size: number;
    total_amount: number | string;
    deposit_paid: number | string;
    customer?: Customer;
    restaurant_table?: RestaurantTable;
    reservation_items: ReservationItem[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedReservations {
    data: Reservation[];
    links: PaginationLink[];
    total: number;
}

interface Props {
    reservations: PaginatedReservations;
    filters: {
        search?: string;
    };
}

const peso = (amount: number | string) =>
    `₱${Number(amount ?? 0).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (date: string) => {
    if (!date) return 'N/A';

    const normalized = date.includes('T') ? date : date.replace(' ', 'T');
    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

export default function Index({ reservations, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.get(
            '/reservations',
            { search: search.trim() },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const clearSearch = () => {
        setSearch('');

        router.get(
            '/reservations',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const deleteReservation = (id: number) => {
        if (!window.confirm(`Are you sure you want to delete reservation #${id}?`)) {
            return;
        }

        router.delete(`/reservations/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Reservation Management" />

            <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                                Restaurant Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-gray-950">
                                Reservation Management
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Manage and monitor all customer reservations.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/dashboard"
                                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/reservations/create"
                                className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
                            >
                                + New Reservation
                            </Link>
                        </div>
                    </div>

                    <div className="mb-6 grid gap-5 sm:grid-cols-2">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Total Reservations
                            </p>

                            <p className="mt-2 text-3xl font-bold text-gray-950">
                                {reservations.total}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Current Page
                            </p>

                            <p className="mt-2 text-3xl font-bold text-gray-950">
                                {reservations.data.length}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Reservation Records
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    View and manage saved reservations and pre-orders.
                                </p>
                            </div>

                            <span className="text-sm text-gray-500">
                                {reservations.data.length} record(s) on this page
                            </span>
                        </div>

                        {/* Search */}
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col gap-3 sm:flex-row"
                            >
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search customer name or contact number..."
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800"
                                    >
                                        Search
                                    </button>

                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        disabled={!search && !filters.search}
                                        className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>

                            {filters.search && (
                                <p className="mt-3 text-sm text-gray-500">
                                    Showing results for:{' '}
                                    <span className="font-semibold text-teal-700">
                                        "{filters.search}"
                                    </span>
                                </p>
                            )}
                        </div>

                        {reservations.data.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-3xl">
                                    📅
                                </div>

                                <h3 className="text-lg font-bold text-gray-900">
                                    {filters.search
                                        ? 'No Matching Reservations'
                                        : 'No Reservations Yet'}
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    {filters.search
                                        ? 'No reservations matched your search. Try another customer name or contact number.'
                                        : 'Start by adding your first customer reservation.'}
                                </p>

                                {filters.search ? (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="mt-5 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        Clear Search
                                    </button>
                                ) : (
                                    <Link
                                        href="/reservations/create"
                                        className="mt-5 inline-block rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
                                    >
                                        + Create Reservation
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full min-w-[1050px] text-left text-sm">
                                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                            <tr>
                                                <th className="px-5 py-4">ID</th>
                                                <th className="px-5 py-4">Customer</th>
                                                <th className="px-5 py-4">Table</th>
                                                <th className="px-5 py-4">Date & Time</th>
                                                <th className="px-5 py-4">Party Size</th>
                                                <th className="px-5 py-4">Pre-orders</th>
                                                <th className="px-5 py-4">Total</th>
                                                <th className="px-5 py-4">Deposit</th>
                                                <th className="px-5 py-4">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                            {reservations.data.map((reservation) => (
                                                <tr
                                                    key={reservation.id}
                                                    className="transition hover:bg-gray-50"
                                                >
                                                    <td className="whitespace-nowrap px-5 py-5 font-semibold text-teal-700">
                                                        #{reservation.id}
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <p className="font-semibold text-gray-900">
                                                            {reservation.customer?.customer_name ?? 'Unknown Customer'}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {reservation.customer?.contact_number ?? 'No contact number'}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <span className="inline-block rounded-lg bg-yellow-100 px-3 py-1 font-semibold text-gray-800">
                                                            {reservation.restaurant_table
                                                                ? `Table ${reservation.restaurant_table.table_number}`
                                                                : 'Table N/A'}
                                                        </span>
                                                    </td>

                                                    <td className="whitespace-nowrap px-5 py-5 text-gray-600">
                                                        {formatDate(reservation.reservation_time)}
                                                    </td>

                                                    <td className="whitespace-nowrap px-5 py-5 text-gray-700">
                                                        {reservation.party_size} guest(s)
                                                    </td>

                                                    <td className="max-w-[220px] px-5 py-5">
                                                        {reservation.reservation_items?.length ? (
                                                            <div className="space-y-2">
                                                                {reservation.reservation_items.map((item) => (
                                                                    <div key={item.id}>
                                                                        <p className="font-medium text-gray-800">
                                                                            {item.menu_item?.name ?? 'Unknown Item'}
                                                                        </p>

                                                                        <p className="text-xs text-gray-500">
                                                                            Quantity: {item.quantity}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                No pre-orders
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="whitespace-nowrap px-5 py-5 font-semibold text-gray-900">
                                                        {peso(reservation.total_amount)}
                                                    </td>

                                                    <td className="whitespace-nowrap px-5 py-5 font-semibold text-teal-700">
                                                        {peso(reservation.deposit_paid)}
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <div className="flex flex-wrap gap-2">
                                                            <Link
                                                                href={`/reservations/${reservation.id}`}
                                                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                                                            >
                                                                View
                                                            </Link>

                                                            <Link
                                                                href={`/reservations/${reservation.id}/edit`}
                                                                className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-yellow-500"
                                                            >
                                                                Edit
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    deleteReservation(reservation.id)
                                                                }
                                                                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {reservations.links.length > 3 && (
                                    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gray-200 px-6 py-5">
                                        {reservations.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url ?? '#'}
                                                preserveScroll
                                                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                                    link.active
                                                        ? 'bg-teal-700 text-white'
                                                        : link.url
                                                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                          : 'cursor-not-allowed bg-gray-50 text-gray-400'
                                                }`}
                                                aria-disabled={!link.url}
                                            >
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <p className="mt-6 text-center text-xs text-gray-400">
                        Restaurant Table Reservation & Pre-Order System
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
