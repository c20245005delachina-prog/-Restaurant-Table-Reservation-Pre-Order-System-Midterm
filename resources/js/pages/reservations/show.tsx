import { Head, Link } from '@inertiajs/react';

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
    party_size: number;
    deposit_paid: number | string;
    customer?: Customer | null;
    restaurant_table?: RestaurantTable | null;
    restaurantTable?: RestaurantTable | null;
    reservation_items?: ReservationItem[];
    reservationItems?: ReservationItem[];
}

interface Props {
    reservation: Reservation;
}

const money = (amount: number | string | undefined) =>
    `₱${Number(amount ?? 0).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (date: string) => {
    if (!date) return '—';

    const parsed = new Date(date.replace(' ', 'T'));

    return Number.isNaN(parsed.getTime())
        ? date
        : parsed.toLocaleString('en-PH', {
              dateStyle: 'long',
              timeStyle: 'short',
          });
};

export default function Show({ reservation }: Props) {
    const table =
        reservation.restaurantTable ?? reservation.restaurant_table;

    const items =
        reservation.reservationItems ?? reservation.reservation_items ?? [];

    const orderTotal = items.reduce(
        (sum, item) =>
            sum + Number(item.unit_price ?? 0) * Number(item.quantity ?? 0),
        0
    );

    const deposit = Number(reservation.deposit_paid ?? 0);
    const remainingBalance = Math.max(orderTotal - deposit, 0);

    return (
        <>
            <Head title={`Reservation #${reservation.id}`} />

            <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 px-4 py-8 text-slate-800 sm:px-8">
                <div className="mx-auto max-w-5xl">
                    <Link
                        href="/reservations"
                        className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2 font-semibold text-purple-700 shadow-sm transition hover:bg-purple-50"
                    >
                        ← Back to Reservations
                    </Link>

                    <header className="mt-6 flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-r from-purple-700 via-violet-600 to-fuchsia-500 p-7 text-white shadow-xl sm:flex-row sm:items-center sm:p-9">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-purple-100">
                                Reservation Details
                            </p>

                            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                                Booking #{reservation.id}
                            </h1>

                            <p className="mt-2 text-purple-100">
                                Review customer, table, and pre-order information.
                            </p>
                        </div>

                        <Link
                            href={`/reservations/${reservation.id}/edit`}
                            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-bold text-purple-700 transition hover:bg-pink-100"
                        >
                            ✎ Edit Reservation
                        </Link>
                    </header>

                    <div className="mt-7 grid gap-6 md:grid-cols-2">
                        {/* Customer details */}
                        <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl">
                                    👤
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-purple-800">
                                        Customer Information
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Contact details
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Customer Name
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {reservation.customer?.customer_name ??
                                            'Customer unavailable'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Contact Number
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {reservation.customer?.contact_number ??
                                            'No contact number'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Booking details */}
                        <section className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-xl">
                                    📅
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-pink-800">
                                        Booking Information
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Schedule and seating
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Reservation Date and Time
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {formatDate(reservation.reservation_time)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Table Number
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {table?.table_number ?? 'Not assigned'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Table Capacity
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {table?.table_capacity ?? '—'} seats
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Number of Guests
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {reservation.party_size ?? '—'}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Pre-order */}
                    <section className="mt-7 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-5">
                            <h2 className="text-xl font-bold text-purple-800">
                                🍽️ Pre-Order Details
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Menu items and order amounts
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-violet-50 text-xs uppercase text-purple-700">
                                    <tr>
                                        <th className="px-6 py-4">Menu Item</th>
                                        <th className="px-6 py-4">Unit Price</th>
                                        <th className="px-6 py-4">Quantity</th>
                                        <th className="px-6 py-4 text-right">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-purple-50">
                                    {items.length > 0 ? (
                                        items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 font-semibold">
                                                    {item.menuItem?.menu_item_name ??
                                                        'Menu item unavailable'}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {money(item.unit_price)}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.quantity}
                                                </td>

                                                <td className="px-6 py-4 text-right font-semibold text-purple-700">
                                                    {money(
                                                        Number(item.unit_price) *
                                                            item.quantity
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-10 text-center text-slate-500"
                                            >
                                                No pre-order items for this reservation.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Payment summary */}
                    <section className="mt-7 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-xl font-bold text-purple-800">
                            Payment Summary
                        </h2>

                        <div className="mt-5 space-y-4">
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500">
                                    Pre-order Total
                                </span>
                                <span className="font-semibold">
                                    {money(orderTotal)}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500">
                                    Deposit Paid
                                </span>
                                <span className="font-semibold text-pink-600">
                                    {money(deposit)}
                                </span>
                            </div>

                            <div className="border-t border-purple-100 pt-4">
                                <div className="flex justify-between gap-4">
                                    <span className="font-bold text-purple-800">
                                        Remaining Balance
                                    </span>
                                    <span className="text-xl font-extrabold text-purple-700">
                                        {money(remainingBalance)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-400">
                            The remaining balance is calculated from the
                            pre-order total minus the deposit. Verify payment
                            records separately if other charges apply.
                        </p>
                    </section>

                    <footer className="py-8 text-center text-sm text-purple-400">
                        💜 Restaurant Reservation &amp; Pre-Order System
                    </footer>
                </div>
            </main>
        </>
    );
}
