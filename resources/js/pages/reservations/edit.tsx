
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

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
    item_category?: string;
    item_price: number | string;
}

interface ReservationItem {
    id?: number;
    menu_item_id: number;
    quantity: number;
    unit_price?: number | string;
}

interface Reservation {
    id: number;
    customer_id: number;
    restaurant_table_id: number;
    reservation_time: string;
    party_size: number;
    deposit_paid: number | string;
    total_amount: number | string;
    customer?: Customer;
    restaurant_table?: RestaurantTable;
    reservation_items: ReservationItem[];
}

interface OrderItem {
    menu_item_id: number;
    quantity: number;
}

interface ReservationForm {
    [key: string]: any;
    customer_name: string;
    contact_number: string;
    restaurant_table_id: string;
    reservation_time: string;
    party_size: number;
    deposit_paid: string;
    items: OrderItem[];
}

interface Props {
    reservation: Reservation;
    customers: Customer[];
    tables: RestaurantTable[];
    menuItems: MenuItem[];
}

const inputStyle =
    'w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 opacity-100 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100';

const labelStyle =
    'mb-2 block text-sm font-semibold text-gray-800';

const cardStyle =
    'min-w-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7';

const peso = (amount: number) =>
    `₱${amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

// Preserve the database's local date and time.
// Do not convert the value to UTC.
function formatDateTime(value: string): string {
    if (!value) return '';

    return value.replace(' ', 'T').slice(0, 16);
}

export default function Edit({
    reservation,
    customers = [],
    tables = [],
    menuItems = [],
}: Props) {
    const [selectedCustomerId, setSelectedCustomerId] = useState(
        String(reservation.customer_id ?? ''),
    );

    const initialItems: OrderItem[] =
        reservation.reservation_items?.map((item) => ({
            menu_item_id: Number(item.menu_item_id),
            quantity: Number(item.quantity),
        })) ?? [];

    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm<ReservationForm>({
        customer_name: reservation.customer?.customer_name ?? '',
        contact_number: reservation.customer?.contact_number ?? '',
        restaurant_table_id: String(reservation.restaurant_table_id ?? ''),
        reservation_time: formatDateTime(reservation.reservation_time),
        party_size: Number(reservation.party_size ?? 1),
        deposit_paid: String(reservation.deposit_paid ?? 0),
        items: initialItems.length
            ? initialItems
            : [{ menu_item_id: 0, quantity: 1 }],
    });

    const totalAmount = useMemo(() => {
        return data.items.reduce((total, item) => {
            const menu = menuItems.find(
                (entry) => entry.id === Number(item.menu_item_id),
            );

            return (
                total +
                Number(menu?.item_price ?? 0) *
                    Number(item.quantity || 0)
            );
        }, 0);
    }, [data.items, menuItems]);

    const depositAmount = Number(data.deposit_paid || 0);

    const remainingBalance = Math.max(
        0,
        totalAmount - depositAmount,
    );

    const excessPayment = Math.max(
        0,
        depositAmount - totalAmount,
    );

    const selectedTable = tables.find(
        (table) =>
            Number(table.id) === Number(data.restaurant_table_id),
    );

    const itemErrors = errors as Record<string, string | undefined>;

    const handleCustomerChange = (customerId: string) => {
        setSelectedCustomerId(customerId);

        const customer = customers.find(
            (item) => String(item.id) === customerId,
        );

        if (customer) {
            setData((previous) => ({
                ...previous,
                customer_name: customer.customer_name,
                contact_number: customer.contact_number,
            }));
        }
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                menu_item_id: 0,
                quantity: 1,
            },
        ]);
    };

    const removeItem = (index: number) => {
        const updatedItems = data.items.filter(
            (_, itemIndex) => itemIndex !== index,
        );

        setData(
            'items',
            updatedItems.length
                ? updatedItems
                : [{ menu_item_id: 0, quantity: 1 }],
        );
    };

    const updateItem = (
        index: number,
        field: keyof OrderItem,
        value: number,
    ) => {
        const updatedItems = [...data.items];

        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        };

        setData('items', updatedItems);
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/reservations/${reservation.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Reservation" />

            <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-7xl">

                    {/* PAGE HEADER */}
                    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                                Restaurant Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-gray-950">
                                Edit Reservation
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Update reservation #{reservation.id} details.
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
                                className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
                            >
                                Back to Reservations
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">

                        {/* CUSTOMER INFORMATION */}
                        <section className={cardStyle}>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Customer Information
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Update the customer's name and contact details.
                                </p>
                            </div>

                            <div className="grid min-w-0 gap-5 md:grid-cols-2">
                                <div className="min-w-0">
                                    <label htmlFor="customer_id" className={labelStyle}>
                                        Select Customer
                                    </label>

                                    <select
                                        id="customer_id"
                                        value={selectedCustomerId}
                                        onChange={(event) =>
                                            handleCustomerChange(event.target.value)
                                        }
                                        className={inputStyle}
                                    >
                                        <option value="">
                                             Select Customer 
                                        </option>

                                        {customers.map((customer) => (
                                            <option
                                                key={customer.id}
                                                value={customer.id}
                                            >
                                                {customer.customer_name} - {customer.contact_number}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="min-w-0">
                                    <label htmlFor="customer_name" className={labelStyle}>
                                        Customer Name *
                                    </label>

                                    <input
                                        id="customer_name"
                                        type="text"
                                        value={data.customer_name}
                                        onChange={(event) => {
                                            setSelectedCustomerId('');
                                            setData('customer_name', event.target.value);
                                        }}
                                        placeholder="Enter customer name"
                                        required
                                        className={inputStyle}
                                    />

                                    {errors.customer_name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.customer_name}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label htmlFor="contact_number" className={labelStyle}>
                                        Contact Number *
                                    </label>

                                    <input
                                        id="contact_number"
                                        type="tel"
                                        value={data.contact_number}
                                        onChange={(event) => {
                                            setSelectedCustomerId('');
                                            setData('contact_number', event.target.value);
                                        }}
                                        placeholder="Enter contact number"
                                        required
                                        className={inputStyle}
                                    />

                                    {errors.contact_number && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.contact_number}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* RESERVATION DETAILS */}
                        <section className={cardStyle}>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Reservation Details
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Change the reserved table, schedule, and number of guests.
                                </p>
                            </div>

                            <div className="grid min-w-0 gap-5 md:grid-cols-2">
                                <div className="min-w-0">
                                    <label
                                        htmlFor="restaurant_table_id"
                                        className={labelStyle}
                                    >
                                        Restaurant Table *
                                    </label>

                                    <select
                                        id="restaurant_table_id"
                                        value={data.restaurant_table_id}
                                        onChange={(event) =>
                                            setData(
                                                'restaurant_table_id',
                                                event.target.value,
                                            )
                                        }
                                        required
                                        className={inputStyle}
                                    >
                                        <option value="">
                                             Select Table 
                                        </option>

                                        {tables.map((table) => (
                                            <option
                                                key={table.id}
                                                value={table.id}
                                            >
                                                Table {table.table_number} - Capacity: {table.table_capacity}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedTable && (
                                        <p className="mt-2 text-sm text-teal-700">
                                            Table capacity: {selectedTable.table_capacity} guests.
                                        </p>
                                    )}

                                    {selectedTable &&
                                        data.party_size > selectedTable.table_capacity && (
                                            <p className="mt-2 text-sm text-red-600">
                                                Guest count exceeds this table's capacity.
                                            </p>
                                        )}

                                    {errors.restaurant_table_id && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.restaurant_table_id}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label
                                        htmlFor="reservation_time"
                                        className={labelStyle}
                                    >
                                        Reservation Date and Time *
                                    </label>

                                    <input
                                        id="reservation_time"
                                        type="datetime-local"
                                        value={data.reservation_time}
                                        onChange={(event) =>
                                            setData(
                                                'reservation_time',
                                                event.target.value,
                                            )
                                        }
                                        required
                                        className={inputStyle}
                                    />

                                    {errors.reservation_time && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.reservation_time}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label htmlFor="party_size" className={labelStyle}>
                                        Number of Guests *
                                    </label>

                                    <input
                                        id="party_size"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={data.party_size}
                                        onChange={(event) =>
                                            setData(
                                                'party_size',
                                                Math.max(
                                                    1,
                                                    Number(event.target.value) || 1,
                                                ),
                                            )
                                        }
                                        required
                                        className={inputStyle}
                                    />

                                    {errors.party_size && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.party_size}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* PRE-ORDER MENU */}
                        <section className={cardStyle}>
                            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Pre-Order Menu Items
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Update existing items or add more menu items.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="shrink-0 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                                >
                                    + Add Item
                                </button>
                            </div>

                            {menuItems.length === 0 && (
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                                    No menu items are available. Add menu items before updating the pre-order.
                                </div>
                            )}

                            <div className="space-y-4">
                                {data.items.map((item, index) => {
                                    const menu = menuItems.find(
                                        (entry) =>
                                            entry.id === Number(item.menu_item_id),
                                    );

                                    const subtotal =
                                        Number(menu?.item_price ?? 0) *
                                        Number(item.quantity || 0);

                                    return (
                                        <div
                                            key={index}
                                            className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-4"
                                        >
                                            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
                                                <div className="min-w-0 lg:col-span-5">
                                                    <label
                                                        htmlFor={`menu_item_${index}`}
                                                        className={labelStyle}
                                                    >
                                                        Menu Item
                                                    </label>

                                                    <select
                                                        id={`menu_item_${index}`}
                                                        value={item.menu_item_id}
                                                        onChange={(event) =>
                                                            updateItem(
                                                                index,
                                                                'menu_item_id',
                                                                Number(event.target.value),
                                                            )
                                                        }
                                                        required
                                                        className={inputStyle}
                                                    >
                                                        <option value={0}>
                                                            -- Select Menu Item --
                                                        </option>

                                                        {menuItems.map((entry) => (
                                                            <option
                                                                key={entry.id}
                                                                value={entry.id}
                                                            >
                                                                {entry.menu_item_name} - {peso(Number(entry.item_price))}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {itemErrors[`items.${index}.menu_item_id`] && (
                                                        <p className="mt-2 text-sm text-red-600">
                                                            {itemErrors[`items.${index}.menu_item_id`]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="min-w-0 lg:col-span-2">
                                                    <label
                                                        htmlFor={`quantity_${index}`}
                                                        className={labelStyle}
                                                    >
                                                        Quantity
                                                    </label>

                                                    <input
                                                        id={`quantity_${index}`}
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        value={item.quantity}
                                                        onChange={(event) =>
                                                            updateItem(
                                                                index,
                                                                'quantity',
                                                                Math.max(
                                                                    1,
                                                                    Number(event.target.value) || 1,
                                                                ),
                                                            )
                                                        }
                                                        required
                                                        className={inputStyle}
                                                    />

                                                    {itemErrors[`items.${index}.quantity`] && (
                                                        <p className="mt-2 text-sm text-red-600">
                                                            {itemErrors[`items.${index}.quantity`]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="min-w-0 lg:col-span-3">
                                                    <label className={labelStyle}>
                                                        Subtotal
                                                    </label>

                                                    <div className="flex min-h-[48px] items-center rounded-lg border border-gray-300 bg-white px-4 py-3 font-bold text-teal-800">
                                                        {peso(subtotal)}
                                                    </div>
                                                </div>

                                                <div className="min-w-0 lg:col-span-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="w-full rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {errors.items && (
                                <p className="mt-3 text-sm text-red-600">
                                    {errors.items}
                                </p>
                            )}

                            <div className="mt-6 flex justify-end">
                                <div className="w-full rounded-lg bg-teal-50 p-5 sm:max-w-sm">
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Pre-order Amount
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-teal-800">
                                        {peso(totalAmount)}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* PAYMENT DETAILS */}
                        <section className={cardStyle}>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Payment Details
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Enter any non-negative deposit amount paid by the customer.
                                </p>
                            </div>

                            <div className="grid min-w-0 gap-5 md:grid-cols-2">
                                <div className="min-w-0">
                                    <label
                                        htmlFor="deposit_paid"
                                        className={labelStyle}
                                    >
                                        Deposit Paid (₱)
                                    </label>

                                    <input
                                        id="deposit_paid"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.deposit_paid}
                                        onChange={(event) =>
                                            setData(
                                                'deposit_paid',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        className={inputStyle}
                                    />

                                    {errors.deposit_paid && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.deposit_paid}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="rounded-lg bg-yellow-50 p-5">
                                        <p className="text-sm font-medium text-gray-600">
                                            Remaining Balance
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-gray-900">
                                            {peso(remainingBalance)}
                                        </p>
                                    </div>

                                    {excessPayment > 0 && (
                                        <div className="rounded-lg bg-teal-50 p-5">
                                            <p className="text-sm font-medium text-gray-600">
                                                Excess Payment
                                            </p>

                                            <p className="mt-2 text-2xl font-bold text-teal-800">
                                                {peso(excessPayment)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* FORM ACTIONS */}
                        <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-6 sm:flex-row">
                            <Link
                                href="/reservations"
                                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    (!!selectedTable &&
                                        data.party_size > selectedTable.table_capacity)
                                }
                                className="rounded-lg bg-teal-700 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Updating Reservation...'
                                    : 'Update Reservation'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-xs text-gray-400">
                        Restaurant Table Reservation & Pre-Order System
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
