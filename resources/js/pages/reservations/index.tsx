
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
        const confirmed = window.confirm(
            `Are you sure you want to cancel reservation #${id}?`
        );

        if (confirmed) {
            router.delete(`/reservations/${id}`);
        }
    };

    return (
        <>
            <Head title="Reservations" />

            <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 px-4 py-8 text-slate-800 sm:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
                                Reservation Management
                            </p>

                            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                                Reservations
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Manage bookings, seating, and pre-order details.
                            </p>
                        </div>

                        <Link
                            href="/reservations/create"
                            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-3 font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:from-purple-700 hover:to-pink-600"
                        >
                            + New Reservation
                        </Link>
                    </header>

                    {/* Summary cards */}
                    <section className="mb-8 grid gap-5 sm:grid-cols-2">
                        <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">
                                Reservations on this page
                            </p>

                            <p className="mt-3 text-4xl font-extrabold text-purple-700">
                                {reservations.data.length}
                            </p>

                            <p className="mt-2 text-sm text-purple-500">
                                Current page bookings
                            </p>
                        </div>

                        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">
                                Deposits recorded on this page
                            </p>

                            <p className="mt-3 text-4xl font-extrabold text-pink-600">
                                {money(totalDeposits)}
                            </p>

                            <p className="mt-2 text-sm text-pink-500">
                                Total deposits for displayed reservations
                            </p>
                        </div>
                    </section>

                    {/* Reservation table */}
                    <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-md shadow-purple-100/50">
                        <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-5">
                            <h2 className="text-xl font-bold">
                                Reservation List
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Review each booking and its pre-order items.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-violet-50 text-xs uppercase tracking-wider text-purple-700">
                                    <tr>
                                        <th className="px-5 py-4">Customer</th>
                                        <th className="px-5 py-4">Table</th>
                                        <th className="px-5 py-4">
                                            Reservation Time
                                        </th>
                                        <th className="px-5 py-4">Pre-Order</th>
                                        <th className="px-5 py-4">Deposit</th>
                                        <th className="px-5 py-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-purple-50">
                                    {reservations.data.length > 0 ? (
                                        reservations.data.map((reservation) => (
                                            <tr
                                                key={reservation.id}
                                                className="align-top transition hover:bg-purple-50/60"
                                            >
                                                {/* Customer */}
                                                <td className="px-5 py-5">
                                                    <p className="font-semibold text-slate-800">
                                                        {reservation.customer?.customer_name ??
                                                            'Customer unavailable'}
                                                    </p>

                                                    <p className="mt-1 text-slate-500">
                                                        {reservation.customer?.contact_number ??
                                                            'No contact number'}
                                                    </p>

                                                    <p className="mt-1 text-xs text-purple-500">
                                                        Booking #{reservation.id}
                                                    </p>
                                                </td>

                                                {/* Table */}
                                                <td className="whitespace-nowrap px-5 py-5">
                                                    <span className="rounded-full bg-purple-100 px-3 py-1 font-semibold text-purple-700">
                                                        Table{' '}
                                                        {reservation.restaurantTable?.table_number ??
                                                            '—'}
                                                    </span>

                                                    {reservation.restaurantTable && (
                                                        <p className="mt-2 text-xs text-slate-500">
                                                            Capacity:{' '}
                                                            {
                                                                reservation
                                                                    .restaurantTable
                                                                    .table_capacity
                                                            }
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Reservation date */}
                                                <td className="whitespace-nowrap px-5 py-5 text-slate-600">
                                                    {formatDate(
                                                        reservation.reservation_time
                                                    )}

                                                    {reservation.party_size != null && (
                                                        <p className="mt-2 text-xs text-slate-500">
                                                            Guests:{' '}
                                                            {reservation.party_size}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Pre-order items */}
                                                <td className="min-w-48 px-5 py-5">
                                                    {reservation.reservationItems?.length ? (
                                                        <ul className="space-y-2">
                                                            {reservation.reservationItems.map(
                                                                (item) => (
                                                                    <li key={item.id}>
                                                                        <p className="font-medium text-slate-700">
                                                                            {item.menuItem
                                                                                ?.menu_item_name ??
                                                                                'Menu item'}{' '}
                                                                            × {item.quantity}
                                                                        </p>

                                                                        <p className="text-xs text-slate-500">
                                                                            {money(
                                                                                Number(
                                                                                    item.unit_price
                                                                                ) *
                                                                                    item.quantity
                                                                            )}
                                                                        </p>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <span className="text-slate-400">
                                                            No pre-order items
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Deposit */}
                                                <td className="whitespace-nowrap px-5 py-5">
                                                    <span className="rounded-full bg-pink-100 px-3 py-1 font-bold text-pink-700">
                                                        {money(
                                                            reservation.deposit_paid
                                                        )}
                                                    </span>
                                                </td>

                                                {/* Action buttons */}
                                                <td className="px-5 py-5">
                                                    <div className="flex min-w-40 flex-wrap gap-2">
                                                        <Link
                                                            href={`/reservations/${reservation.id}`}
                                                            className="rounded-lg bg-purple-100 px-3 py-2 text-xs font-bold text-purple-700 transition hover:bg-purple-200"
                                                        >
                                                            View
                                                        </Link>

                                                        <Link
                                                            href={`/reservations/${reservation.id}/edit`}
                                                            className="rounded-lg bg-pink-100 px-3 py-2 text-xs font-bold text-pink-700 transition hover:bg-pink-200"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                cancelReservation(
                                                                    reservation.id
                                                                )
                                                            }
                                                            className="rounded-lg bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-16 text-center"
                                            >
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
                                                    💜
                                                </div>

                                                <h3 className="mt-4 text-lg font-bold">
                                                    No reservations yet
                                                </h3>

                                                <p className="mt-2 text-slate-500">
                                                    Create your first reservation
                                                    to get started.
                                                </p>

                                                <Link
                                                    href="/reservations/create"
                                                    className="mt-5 inline-flex rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
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
                            <nav
                                aria-label="Reservation pagination"
                                className="flex flex-wrap items-center justify-between gap-4 border-t border-purple-100 px-6 py-4"
                            >
                                <p className="text-sm text-slate-500">
                                    {reservations.total ??
                                        reservations.data.length}{' '}
                                    total reservations
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {reservations.links.map((link, index) => (
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
                                            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                                                link.active
                                                    ? 'border-purple-600 bg-purple-600 text-white'
                                                    : link.url
                                                      ? 'border-purple-100 text-purple-700 hover:bg-purple-50'
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

                    {/* Footer */}
                    <footer className="py-8 text-center text-sm text-purple-400">
                        💜 Restaurant Reservation &amp; Pre-Order System
                    </footer>
                </div>
            </main>
        </>
    );
}
