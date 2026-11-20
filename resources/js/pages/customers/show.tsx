
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface ReservationItem {
    id: number;
    quantity: number;
    unit_price: number | string;
    menu_item?: {
        name: string;
    };
}

interface Reservation {
    id: number;
    reservation_time: string;
    party_size: number;
    total_amount?: number | string;
    deposit_paid: number | string;
    reservation_items?: ReservationItem[];
    restaurant_table?: {
        table_number: string;
    };
}

interface Customer {
    id: number;
    customer_name: string;
    contact_number: string;
    created_at?: string;
    reservations?: Reservation[];
}

interface ShowProps {
    customer: Customer;
}

const formatMoney = (amount: number | string | undefined) => {
    return `₱${Number(amount ?? 0).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
};

export default function Show({ customer }: ShowProps) {
    const reservations = customer.reservations ?? [];

    return (
        <AppLayout>
            <Head title="Customer Details" />

            <div className="min-h-screen bg-gray-100 px-6 py-8">
                <div className="mx-auto max-w-7xl">

                    {/* PAGE HEADER */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                                Customer Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-gray-900">
                                Customer Details
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                View customer information and reservation history.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/dashboard"
                                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >
                                ← Dashboard
                            </Link>

                            <Link
                                href="/customers"
                                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >
                                Customers
                            </Link>

                            <Link
                                href={`/customers/${customer.id}/edit`}
                                className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
                            >
                                Edit Customer
                            </Link>
                        </div>
                    </div>

                    {/* CUSTOMER INFORMATION */}
                    <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-5 sm:px-8">
                            <h2 className="text-lg font-bold text-gray-900">
                                Customer Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Registered customer profile.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8">
                            {/* NAME */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-xl font-bold text-teal-700">
                                    {customer.customer_name.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Customer Name
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-gray-900">
                                        {customer.customer_name}
                                    </p>
                                </div>
                            </div>

                            {/* CONTACT */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50 text-2xl">
                                    ☎
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Contact Number
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-gray-900">
                                        {customer.contact_number}
                                    </p>
                                </div>
                            </div>

                            {/* CUSTOMER ID */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    Customer ID
                                </p>

                                <p className="mt-1 font-semibold text-gray-900">
                                    #{customer.id}
                                </p>
                            </div>

                            {/* DATE REGISTERED */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    Date Registered
                                </p>

                                <p className="mt-1 font-semibold text-gray-900">
                                    {customer.created_at
                                        ? new Date(customer.created_at).toLocaleDateString('en-PH', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                          })
                                        : 'Not available'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RESERVATION SUMMARY */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Total Reservations
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                {reservations.length}
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Reservations linked to this customer
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Total Deposits Paid
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-teal-700">
                                {formatMoney(
                                    reservations.reduce(
                                        (total, reservation) =>
                                            total + Number(reservation.deposit_paid ?? 0),
                                        0,
                                    ),
                                )}
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Combined deposits from reservations
                            </p>
                        </div>
                    </div>

                    {/* RESERVATION HISTORY */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Reservation History
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    All reservations made by this customer.
                                </p>
                            </div>

                            <Link
                                href="/reservations/create"
                                className="rounded-lg bg-teal-700 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-teal-800"
                            >
                                + New Reservation
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">
                                            Reservation ID
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            Date and Time
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            Table
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            Guests
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            Deposit
                                        </th>

                                        <th className="px-6 py-4 text-center font-semibold">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {reservations.length > 0 ? (
                                        reservations.map((reservation) => (
                                            <tr
                                                key={reservation.id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    #{reservation.id}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {formatDate(reservation.reservation_time)}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {reservation.restaurant_table?.table_number ?? 'N/A'}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {reservation.party_size}
                                                </td>

                                                <td className="px-6 py-4 font-semibold text-teal-700">
                                                    {formatMoney(reservation.deposit_paid)}
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={`/reservations/${reservation.id}`}
                                                        className="inline-block rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-16 text-center"
                                            >
                                                <div className="text-4xl">📅</div>

                                                <p className="mt-3 font-semibold text-gray-700">
                                                    No reservations yet
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    This customer does not have any reservation records.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* INFORMATION NOTE */}
                    <div className="mt-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                        <span className="text-lg text-yellow-600">!</span>

                        <div>
                            <p className="text-sm font-bold text-gray-800">
                                Customer Record
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                                Keep this customer's contact information accurate
                                so reservation updates can be communicated properly.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
