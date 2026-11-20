
import AppLayout from '@/layouts/app-layout';
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
    name?: string;
    category?: string;
    price?: number | string;
    menu_item_name?: string;
    item_category?: string;
    item_price?: number | string;
}

interface ReservationItem {
    id: number;
    menu_item_id: number;
    quantity: number;
    unit_price: number | string;
    menu_item?: MenuItem | null;
    menuItem?: MenuItem | null;
}

interface Reservation {
    id: number;
    customer_id: number;
    restaurant_table_id: number;
    reservation_time: string;
    party_size: number;
    total_amount: number | string;
    deposit_paid: number | string;
    customer?: Customer | null;
    restaurant_table?: RestaurantTable | null;
    reservation_items?: ReservationItem[];
    reservationItems?: ReservationItem[];
}

interface Props {
    reservation: Reservation;
}

const peso = (amount: number) =>
    `₱${amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

function formatDateTime(value: string): string {
    if (!value) return 'Not specified';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

const cardStyle =
    'min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm';

const headingStyle =
    'text-lg font-bold text-gray-900';

function Detail({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="min-w-0">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 break-words font-semibold text-gray-900">
                {value}
            </p>
        </div>
    );
}

export default function Show({ reservation }: Props) {
    const customer = reservation.customer;
    const table = reservation.restaurant_table;

    const items =
        reservation.reservation_items ??
        reservation.reservationItems ??
        [];

    const totalAmount = Number(reservation.total_amount ?? 0);
    const depositPaid = Number(reservation.deposit_paid ?? 0);

    const remainingBalance = Math.max(
        0,
        totalAmount - depositPaid,
    );

    const excessPayment = Math.max(
        0,
        depositPaid - totalAmount,
    );

    return (
        <AppLayout>
            <Head title={`Reservation #${reservation.id}`} />

            <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-7xl">

                    {/* HEADER */}
                    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                                Restaurant Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-gray-950">
                                Reservation Details
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Review customer, table, payment, and pre-order information.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/dashboard"
                                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
                            >
                                 Dashboard
                            </Link>

                            <Link
                                href="/reservations"
                                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
                            >
                                Back to Reservations
                            </Link>

                            <Link
                                href={`/reservations/${reservation.id}/edit`}
                                className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
                            >
                                ✎ Edit Reservation
                            </Link>
                        </div>
                    </div>

                    {/* RESERVATION NUMBER */}
                    <div className="mb-6 rounded-xl border border-teal-100 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Reservation Reference
                                </p>

                                <h2 className="mt-1 text-3xl font-bold text-teal-800">
                                    #{reservation.id}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {formatDateTime(reservation.reservation_time)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-yellow-50 px-5 py-3">
                                <p className="text-sm text-gray-600">
                                    Number of Guests
                                </p>

                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {reservation.party_size}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CUSTOMER AND TABLE INFORMATION */}
                    <div className="mb-6 grid min-w-0 gap-6 lg:grid-cols-2">

                        {/* CUSTOMER */}
                        <section className={cardStyle}>
                            <div className="border-b border-gray-100 p-5 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-xl">
                                        👤
                                    </div>

                                    <div>
                                        <h2 className={headingStyle}>
                                            Customer Information
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Customer contact details
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
                                <Detail
                                    label="Customer Name"
                                    value={customer?.customer_name ?? 'Not available'}
                                />

                                <Detail
                                    label="Contact Number"
                                    value={customer?.contact_number ?? 'No contact number'}
                                />
                            </div>
                        </section>

                        {/* TABLE AND BOOKING */}
                        <section className={cardStyle}>
                            <div className="border-b border-gray-100 p-5 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-50 text-xl">
                                        📅
                                    </div>

                                    <div>
                                        <h2 className={headingStyle}>
                                            Booking Information
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Reservation schedule and seating
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
                                <Detail
                                    label="Reservation Date and Time"
                                    value={formatDateTime(reservation.reservation_time)}
                                />

                                <Detail
                                    label="Table Number"
                                    value={
                                        table
                                            ? `Table ${table.table_number}`
                                            : 'Not assigned'
                                    }
                                />

                                <Detail
                                    label="Table Capacity"
                                    value={
                                        table
                                            ? `${table.table_capacity} seats`
                                            : 'Not available'
                                    }
                                />

                                <Detail
                                    label="Number of Guests"
                                    value={`${reservation.party_size} guest(s)`}
                                />
                            </div>
                        </section>
                    </div>

                    {/* PRE-ORDER DETAILS */}
                    <section className={`${cardStyle} mb-6`}>
                        <div className="border-b border-gray-100 p-5 sm:p-6">
                            <h2 className={headingStyle}>
                                Pre-Order Menu Items
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Menu items, quantities, and order amounts.
                            </p>
                        </div>

                        {items.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[650px] text-left">
                                    <thead className="bg-gray-50">
                                        <tr className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                            <th className="px-5 py-4">
                                                Menu Item
                                            </th>

                                            <th className="px-5 py-4">
                                                Category
                                            </th>

                                            <th className="px-5 py-4">
                                                Unit Price
                                            </th>

                                            <th className="px-5 py-4">
                                                Quantity
                                            </th>

                                            <th className="px-5 py-4 text-right">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {items.map((item, index) => {
                                            const menu =
                                                item.menu_item ??
                                                item.menuItem ??
                                                null;

                                            const menuName =
                                                menu?.name ??
                                                menu?.menu_item_name ??
                                                'Menu item unavailable';

                                            const category =
                                                menu?.category ??
                                                menu?.item_category ??
                                                '—';

                                            const unitPrice = Number(
                                                item.unit_price ??
                                                menu?.price ??
                                                menu?.item_price ??
                                                0,
                                            );

                                            const quantity = Number(
                                                item.quantity ?? 0,
                                            );

                                            const subtotal =
                                                unitPrice * quantity;

                                            return (
                                                <tr
                                                    key={item.id ?? index}
                                                    className="transition hover:bg-gray-50"
                                                >
                                                    <td className="px-5 py-4">
                                                        <p className="font-semibold text-gray-900">
                                                            {menuName}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-gray-600">
                                                        {category}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-gray-700">
                                                        {peso(unitPrice)}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                                        {quantity}
                                                    </td>

                                                    <td className="px-5 py-4 text-right font-semibold text-teal-800">
                                                        {peso(subtotal)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="font-semibold text-gray-700">
                                    No pre-order items
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    This reservation does not have any menu items.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end border-t border-gray-100 bg-gray-50 p-5 sm:p-6">
                            <div className="w-full sm:max-w-sm">
                                <p className="text-sm text-gray-500">
                                    Total Pre-Order Amount
                                </p>

                                <p className="mt-1 text-3xl font-bold text-teal-800">
                                    {peso(totalAmount)}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* PAYMENT DETAILS */}
                    <section className={`${cardStyle} mb-6`}>
                        <div className="border-b border-gray-100 p-5 sm:p-6">
                            <h2 className={headingStyle}>
                                Payment Details
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Deposit payment and remaining balance.
                            </p>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
                            <div className="rounded-lg bg-teal-50 p-5">
                                <p className="text-sm font-medium text-gray-600">
                                    Total Amount
                                </p>

                                <p className="mt-2 text-2xl font-bold text-teal-800">
                                    {peso(totalAmount)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-yellow-50 p-5">
                                <p className="text-sm font-medium text-gray-600">
                                    Deposit Paid
                                </p>

                                <p className="mt-2 text-2xl font-bold text-gray-900">
                                    {peso(depositPaid)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-100 p-5">
                                <p className="text-sm font-medium text-gray-600">
                                    Remaining Balance
                                </p>

                                <p className="mt-2 text-2xl font-bold text-gray-900">
                                    {peso(remainingBalance)}
                                </p>
                            </div>
                        </div>

                        {excessPayment > 0 && (
                            <div className="mx-5 mb-5 rounded-lg border border-teal-200 bg-teal-50 p-5 sm:mx-6 sm:mb-6">
                                <p className="text-sm font-medium text-teal-800">
                                    Excess Payment
                                </p>

                                <p className="mt-1 text-2xl font-bold text-teal-900">
                                    {peso(excessPayment)}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* FOOTER */}
                    <div className="flex flex-col justify-between gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center">
                        <p className="text-xs text-gray-500">
                            Restaurant Table Reservation & Pre-Order System
                        </p>

                        <Link
                            href="/reservations"
                            className="text-sm font-semibold text-teal-700 hover:text-teal-900"
                        >
                             Return to Reservation Records
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
