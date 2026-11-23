
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

interface OrderItem {
    menu_item_id: number;
    quantity: number;
}

interface ReservationForm {
    [key: string]: any;
    customer_name: string;
    contact_number: string;
    restaurant_table_id: number | string;
    reservation_time: string;
    party_size: number;
    deposit_paid: number | string;
    items: OrderItem[];
}

interface Props {
    customers: Customer[];
    tables: RestaurantTable[];
    menuItems: MenuItem[];
}

const inputStyle =
    'w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100';

const labelStyle = 'mb-2 block text-sm font-semibold text-gray-800';

const peso = (amount: number) =>
    `₱${amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export default function Create({
    customers = [],
    tables = [],
    menuItems = [],
}: Props) {
    const [selectedCustomerId, setSelectedCustomerId] = useState('');

    const { data, setData, post, processing, errors } =
        useForm<ReservationForm>({
            customer_name: '',
            contact_number: '',
            restaurant_table_id: '',
            reservation_time: '',
            party_size: 1,
            deposit_paid: '',
            items: [{ menu_item_id: 0, quantity: 1 }],
        });

    const totalAmount = useMemo(
        () =>
            data.items.reduce((total, item) => {
                const menu = menuItems.find(
                    (entry) => entry.id === Number(item.menu_item_id),
                );

                return total + Number(menu?.item_price ?? 0) * item.quantity;
            }, 0),
        [data.items, menuItems],
    );

    const selectedTable = tables.find(
        (table) => Number(table.id) === Number(data.restaurant_table_id),
    );

    const depositAmount = Number(data.deposit_paid || 0);
    const remainingBalance = Math.max(0, totalAmount - depositAmount);
    const itemErrors = errors as Record<string, string | undefined>;

    const handleCustomerChange = (customerId: string) => {
        setSelectedCustomerId(customerId);

        const customer = customers.find(
            (item) => String(item.id) === customerId,
        );

        setData((previous) => ({
            ...previous,
            customer_name: customer?.customer_name ?? '',
            contact_number: customer?.contact_number ?? '',
        }));
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            { menu_item_id: 0, quantity: 1 },
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

        post('/reservations', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Create Reservation" />

            <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                                Restaurant Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-gray-950">
                                Create Reservation
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Enter customer details and reservation information.
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
                                href="/reservations"
                                className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
                            >
                                Back to Reservations
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Customer Information
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Select an existing customer or enter a new customer.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="customer_id" className={labelStyle}>
                                        Select Existing Customer
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
                                            -- New Customer / Enter Manually --
                                        </option>

                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.customer_name} - {customer.contact_number}
                                            </option>
                                        ))}
                                    </select>

                                    {customers.length === 0 && (
                                        <p className="mt-2 text-sm text-amber-700">
                                            No existing customers found. You can enter a new customer manually.
                                        </p>
                                    )}
                                </div>

                                <div className="grid min-w-0 gap-5 md:grid-cols-2">
                                    <div className="min-w-0">
                                        <label htmlFor="customer_name" className={labelStyle}>
                                            Customer Name *
                                        </label>
                                        <input
                                            id="customer_name"
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(event) =>
                                                setData('customer_name', event.target.value)
                                            }
                                            placeholder="Enter customer name"
                                            autoComplete="name"
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
                                            onChange={(event) =>
                                                setData('contact_number', event.target.value)
                                            }
                                            placeholder="Enter contact number"
                                            autoComplete="tel"
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
                            </div>
                        </section>

                        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Reservation Details
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Choose a table, date, time, and number of guests.
                                </p>
                            </div>

                            <div className="grid min-w-0 gap-5 md:grid-cols-2">
                                <div className="min-w-0">
                                    <label htmlFor="restaurant_table_id" className={labelStyle}>
                                        Restaurant Table *
                                    </label>
                                    <select
                                        id="restaurant_table_id"
                                        value={data.restaurant_table_id}
                                        onChange={(event) =>
                                            setData('restaurant_table_id', event.target.value)
                                        }
                                        required
                                        className={inputStyle}
                                    >
                                        <option value="">-- Select Table --</option>
                                        {tables.map((table) => (
                                            <option key={table.id} value={table.id}>
                                                Table {table.table_number} - Capacity: {table.table_capacity}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedTable && (
                                        <p className="mt-2 text-sm text-teal-700">
                                            Maximum seating capacity: {selectedTable.table_capacity} guests.
                                        </p>
                                    )}

                                    {selectedTable && data.party_size > selectedTable.table_capacity && (
                                        <p className="mt-2 text-sm text-red-600">
                                            Guest count exceeds this table's capacity.
                                        </p>
                                    )}

                                    {tables.length === 0 && (
                                        <p className="mt-2 text-sm text-red-600">
                                            No restaurant tables available. Please add a table first.
                                        </p>
                                    )}

                                    {errors.restaurant_table_id && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.restaurant_table_id}
                                        </p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <label htmlFor="reservation_time" className={labelStyle}>
                                        Reservation Date and Time *
                                    </label>
                                    <input
                                        id="reservation_time"
                                        type="datetime-local"
                                        value={data.reservation_time}
                                        onChange={(event) =>
                                            setData('reservation_time', event.target.value)
                                        }
                                        min="2026-01-01T00:00"
                                        max="2030-12-31T23:59"
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
                                                event.target.value === ''
                                                    ? 1
                                                    : Math.max(1, Number(event.target.value)),
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

                        <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Pre-order Menu Items
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Add as many menu items as needed and specify their quantities.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="shrink-0 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800"
                                >
                                    + Add Item
                                </button>
                            </div>

                            {menuItems.length === 0 && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                    No menu items available. Please add menu items before creating a reservation.
                                </div>
                            )}

                            <div className="space-y-4">
                                {data.items.map((item, index) => {
                                    const selectedMenuItem = menuItems.find(
                                        (menu) => menu.id === Number(item.menu_item_id),
                                    );

                                    const subtotal = selectedMenuItem
                                        ? Number(selectedMenuItem.item_price) * item.quantity
                                        : 0;

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
                                                        <option value={0}>-- Select Menu Item --</option>
                                                        {menuItems.map((menu) => (
                                                            <option key={menu.id} value={menu.id}>
                                                                {menu.menu_item_name} - {peso(Number(menu.item_price))}
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
                                                                event.target.value === ''
                                                                    ? 1
                                                                    : Math.max(1, Number(event.target.value)),
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
                                                    <label className={labelStyle}>Subtotal</label>
                                                    <div className="flex min-h-[48px] items-center rounded-lg border border-gray-300 bg-white px-4 py-3 font-bold text-teal-800">
                                                        {peso(subtotal)}
                                                    </div>
                                                </div>

                                                <div className="min-w-0 lg:col-span-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        title="Remove item"
                                                        aria-label={`Remove menu item ${index + 1}`}
                                                        className="w-full rounded-lg bg-red-50 px-4 py-3 font-semibold text-red-600 hover:bg-red-100"
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

                        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="text-xl font-bold text-gray-900">
                                Payment Details
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Enter the deposit amount paid by the customer.
                            </p>

                            <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-2">
                                <div className="min-w-0">
                                    <label htmlFor="deposit_paid" className={labelStyle}>
                                        Deposit Paid (₱)
                                    </label>
                                    <input
                                        id="deposit_paid"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.deposit_paid}
                                        onChange={(event) =>
                                            setData('deposit_paid', event.target.value)
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

                                <div className="rounded-lg bg-yellow-50 p-5">
                                    <p className="text-sm font-medium text-gray-600">
                                        Remaining Balance
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-gray-900">
                                        {peso(remainingBalance)}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-6 sm:flex-row">
                            <Link
                                href="/reservations"
                                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    menuItems.length === 0 ||
                                    tables.length === 0 ||
                                    (!!selectedTable && data.party_size > selectedTable.table_capacity)
                                }
                                className="rounded-lg bg-teal-700 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Saving Reservation...' : 'Save Reservation'}
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
