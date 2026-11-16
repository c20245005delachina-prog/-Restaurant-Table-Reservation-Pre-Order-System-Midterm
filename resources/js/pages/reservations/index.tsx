
import { Head, Link, router } from '@inertiajs/react';

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
    menu_item_name: string;
    item_price: number | string;
}

interface ReservationItem {
    id: number;
    quantity: number;
    unit_price: number | string;
    menuItem?: MenuItem | null;
}

interface Reservation {
    id: number;
    reservation_time: string;
    party_size?: number;
    total_amount?: number | string;
    deposit_paid: number | string;
    customer?: Customer | null;
    restaurantTable?: RestaurantTable | null;
    reservationItems?: ReservationItem[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedReservations {
    data: Reservation[];
    links: PaginationLink[];
    total?: number;
}

interface Props {
    reservations: PaginatedReservations;
}

const money = (amount: number | string | undefined) =>
    `₱${Number(amount ?? 0).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (date: string) => {
    if (!date) return '—';

    const parsedDate = new Date(date.replace(' ', 'T'));

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

export default function Index({ reservations }: Props) {
    const totalDeposits = reservations.data.reduce(
        (sum, reservation) =>
            sum + Number(reservation.deposit_paid ?? 0),
        0
    );

    const cancelReservation = (id: number) => {
        if (window.confirm(`Are you sure you want to cancel reservation #${id}?`)) {
            router.delete(`/reservations/${id}`);
        }
    };

    return (
        <>
            <Head title="Reservations" />

            <main className="min-h-screen bg-purple-50/50 p-4 md:p-8">
                <div className="mx-auto max-w-7xl">

                    {/* Back to Dashboard */}
                    <Link
                        href="/dashboard"
                        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-4 py-2 text-sm font-medium text-purple-700 shadow-sm transition hover:bg-purple-100"
                    >
                        ← Back to Dashboard
                    </Link>

                    {/* Header */}
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-purple-900">
                                Reservations
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage customer bookings and pre-orders.
                            </p>
                        </div>

                        <Link
                            href="/reservations/create"
                            className="rounded-lg bg-purple-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-purple-700"
                        >
                            + New Reservation
                        </Link>
                    </div>

                    {/* Summary */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Reservations on this page
                            </p>
                            <p className="mt-2 text-3xl font-bold text-purple-700">
                                {reservations.data.length}
                            </p>
                        </div>

                        <div className="rounded-xl border border-pink-100 bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Deposits on this page
                            </p>
                            <p className="mt-2 text-3xl font-bold text-pink-600">
                                {money(totalDeposits)}
                            </p>
                        </div>
                    </div>

                    {/* Reservation List */}
                    <div className="overflow-hidden rounded-xl border border-purple-100 bg-white shadow-sm">
                        <div className="border-b border-purple-100 px-5 py-4">
                            <h2 className="font-semibold text-gray-800">
                                Reservation List
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                View and manage your reservations.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-purple-50 text-gray-600">
                                    <tr>
                                        <th className="px-5 py-4">Customer</th>
                                        <th className="px-5 py-4">Table</th>
                                        <th className="px-5 py-4">Date & Time</th>
                                        <th className="px-5 py-4">Pre-Order</th>
                                        <th className="px-5 py-4">Deposit</th>
                                        <th className="px-5 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-purple-50">
                                    {reservations.data.length > 0 ? (
                                        reservations.data.map((reservation) => (
                                            <tr
                                                key={reservation.id}
                                                className="transition hover:bg-purple-50/50"
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-gray-800">
                                                        {reservation.customer?.customer_name ?? 'Customer unavailable'}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {reservation.customer?.contact_number ?? 'No contact number'}
                                                    </p>
                                                    <p className="mt-1 text-xs text-purple-500">
                                                        Booking #{reservation.id}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                                        Table {reservation.restaurantTable?.table_number ?? '—'}
                                                    </span>
                                                    {reservation.restaurantTable && (
                                                        <p className="mt-2 text-xs text-gray-500">
                                                            Capacity: {reservation.restaurantTable.table_capacity}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                                    {formatDate(reservation.reservation_time)}
                                                    {reservation.party_size != null && (
                                                        <p className="mt-2 text-xs text-gray-500">
                                                            Guests: {reservation.party_size}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="min-w-44 px-5 py-4">
                                                    {reservation.reservationItems?.length ? (
                                                        <ul className="space-y-2">
                                                            {reservation.reservationItems.map((item) => (
                                                                <li key={item.id}>
                                                                    <p className="font-medium text-gray-700">
                                                                        {item.menuItem?.menu_item_name ?? 'Menu item'} × {item.quantity}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {money(Number(item.unit_price) * item.quantity)}
                                                                    </p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            No pre-order items
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                                                        {money(reservation.deposit_paid)}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex min-w-40 flex-wrap justify-center gap-2">
                                                        <Link
                                                            href={`/reservations/${reservation.id}`}
                                                            className="rounded-lg bg-purple-100 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-200"
                                                        >
                                                            View
                                                        </Link>

                                                        <Link
                                                            href={`/reservations/${reservation.id}/edit`}
                                                            className="rounded-lg bg-pink-100 px-3 py-2 text-xs font-semibold text-pink-700 hover:bg-pink-200"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => cancelReservation(reservation.id)}
                                                            className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-12 text-center">
                                                <p className="font-semibold text-gray-700">
                                                    No reservations yet.
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Create your first reservation to get started.
                                                </p>
                                                <Link
                                                    href="/reservations/create"
                                                    className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                                                >
                                                    + Create Reservation
                                                </Link>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {reservations.links.length > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-100 p-4">
                                <p className="text-sm text-gray-500">
                                    {reservations.total ?? reservations.data.length} total reservations
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {reservations.links.map((link, index) => (
                                        <Link
                                            key={`${index}-${link.label}`}
                                            href={link.url ?? '#'}
                                            preserveScroll
                                            aria-disabled={!link.url}
                                            onClick={(event) => {
                                                if (!link.url) event.preventDefault();
                                            }}
                                            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                                                link.active
                                                    ? 'border-purple-600 bg-purple-600 text-white'
                                                    : link.url
                                                        ? 'border-purple-100 text-purple-700 hover:bg-purple-50'
                                                        : 'cursor-not-allowed border-gray-100 text-gray-300'
                                            }`}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="mt-6 text-center text-xs text-gray-400">
                        Restaurant Reservation Management System
                    </p>
                </div>
            </main>
        </>
    );
}
