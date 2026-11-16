
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';


interface Customer {
    id: number;
    customer_name: string;
    customer_number: string;
}

interface RestaurantTable {
    id: number;
    table_number: string;
    table_capacity: number;
}

interface MenuItem {
    id: number;
    menu_item_name: string;
    item_category: string;
    item_price: number | string;
}

interface ReservationItem {
    menu_item_id: number;
    quantity: number;
}

interface ReservationFormData {
    [key: string]: any;
    customer_name: string;
    contact_number: string;
    restaurant_table_id: string;
    reservation_time: string;
    party_size: number;
    deposit_paid: number;
    items: ReservationItem[];
}

interface Props {
    customers: Customer[];
    tables: RestaurantTable[];
    menuItems: MenuItem[];
}

export default function CreateReservation({
    customers,
    tables,
    menuItems,
}: Props) {
    const [selectedCustomer, setSelectedCustomer] = useState('');

    const form = useForm<ReservationFormData>({
        customer_name: '',
        contact_number: '',
        restaurant_table_id: '',
        reservation_time: '',
        party_size: 1,
        deposit_paid: 0,
        items: [{ menu_item_id: 0, quantity: 1 }],
    });

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100';

    const labelClass =
        'mb-2 block text-sm font-medium text-gray-700';

    const errorFor = (key: string) =>
        (form.errors as Record<string, string>)[key];

    const totalAmount = form.data.items.reduce((total, item) => {
        const selectedItem = menuItems.find(
            (menu) => menu.id === Number(item.menu_item_id)
        );

        return total +
            (selectedItem
                ? Number(selectedItem.item_price) * item.quantity
                : 0);
    }, 0);

    const addItem = () => {
        form.setData('items', [
            ...form.data.items,
            { menu_item_id: 0, quantity: 1 },
        ]);
    };

    const removeItem = (index: number) => {
        if (form.data.items.length === 1) return;

        form.setData(
            'items',
            form.data.items.filter((_, i) => i !== index)
        );
    };

    const updateItem = (
        index: number,
        field: keyof ReservationItem,
        value: number
    ) => {
        const updatedItems = [...form.data.items];

        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        };

        form.setData('items', updatedItems);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        form.post('/reservations', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Create Reservation" />

            <div className="min-h-screen bg-[#faf9fc] px-4 py-8 sm:px-8">
                <div className="mx-auto max-w-5xl">

                    {/* Header */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="mb-2 text-sm font-semibold tracking-widest text-purple-500">
                                RESERVATION MANAGEMENT
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Create Reservation
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Enter customer and reservation information below.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
                            >
                                ← Back to Dashboard
                            </Link>

                            <Link
                                href="/reservations"
                                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-purple-50 hover:text-purple-700"
                            >
                                Reservations
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                      {Object.keys(form.errors).length > 0 && (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p className="mb-2 font-semibold">
            Please correct the following errors:
        </p>

        <ul className="list-inside list-disc space-y-1">
            {Object.entries(form.errors).map(([field, message]) => (
                <li key={field}>{message}</li>
            ))}
        </ul>
    </div>
)}
                    
                        {/* Customer Information */}
                        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Customer Information
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Select an existing customer or enter their details.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        Existing Customer
                                    </label>

                                    <select
                                        value={selectedCustomer}
                                        onChange={(e) => {
                                            const id = e.target.value;
                                            setSelectedCustomer(id);

                                            const customer = customers.find(
                                                (item) => item.id === Number(id)
                                            );

                                            form.setData((data) => ({
                                                ...data,
                                                customer_name:
                                                    customer?.customer_name ?? '',
                                                contact_number:
                                                    customer?.customer_number ?? '',
                                            }));
                                        }}
                                        className={inputClass}
                                    >
                                        <option value="">
                                            Select a customer (optional)
                                        </option>

                                        {customers.map((customer) => (
                                            <option
                                                key={customer.id}
                                                value={customer.id}
                                            >
                                                {customer.customer_name} — {customer.customer_number}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Customer Name *
                                    </label>

                                    <input
                                        type="text"
                                        value={form.data.contact_number}
                                        onChange={(e) =>
                                            form.setData('contact_number', e.target.value)
                                        }
                                        placeholder="Enter customer name"
                                        className={inputClass}
                                    />

                                    {errorFor('customer_name') && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errorFor('customer_name')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Contact Number *
                                    </label>

                                    <input
                                        type="text"
                                        value={form.data.contact_number}
                                        onChange={(e) =>
                                            form.setData('contact_number', e.target.value)
                                        }
                                        placeholder="09XXXXXXXXX"
                                        className={inputClass}
                                    />

                                    {errorFor('contact_number') && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errorFor('contact_number')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Reservation Details */}
                        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Reservation Details
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Choose a table, date, and number of guests.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        Restaurant Table *
                                    </label>

                                    <select
                                        value={form.data.restaurant_table_id}
                                        onChange={(e) =>
                                            form.setData(
                                                'restaurant_table_id',
                                                e.target.value
                                            )
                                        }
                                        className={inputClass}
                                    >
                                        <option value="">Select a table</option>

                                        {tables.map((table) => (
                                            <option
                                                key={table.id}
                                                value={table.id}
                                            >
                                                Table {table.table_number} — Capacity: {table.table_capacity}
                                            </option>
                                        ))}
                                    </select>

                                    {errorFor('restaurant_table_id') && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errorFor('restaurant_table_id')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Reservation Date & Time *
                                    </label>

                                    <input
                                        type="datetime-local"
                                        value={form.data.reservation_time}
                                        onChange={(e) =>
                                            form.setData(
                                                'reservation_time',
                                                e.target.value
                                            )
                                        }
                                        className={inputClass}
                                    />

                                    {errorFor('reservation_time') && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errorFor('reservation_time')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Number of Guests *
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={form.data.party_size}
                                        onChange={(e) =>
                                            form.setData(
                                                'party_size',
                                                Number(e.target.value)
                                            )
                                        }
                                        className={inputClass}
                                    />

                                    {errorFor('party_size') && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errorFor('party_size')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Pre-Order Items */}
                        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Pre-Order Items
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Add menu items and specify their quantities.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
                                >
                                    + Add Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(form.data.items ?? []).map((item, index) => {
                                    const selectedMenuItem = menuItems.find(
                                        (menu) =>
                                            menu.id === Number(item.menu_item_id)
                                    );

                                    const subtotal = selectedMenuItem
                                        ? Number(selectedMenuItem.item_price) *
                                          item.quantity
                                        : 0;

                                    return (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-gray-100 bg-gray-50/70 p-4"
                                        >
                                            <div className="grid items-end gap-4 md:grid-cols-12">
                                                <div className="md:col-span-6">
                                                    <label className={labelClass}>
                                                        Menu Item
                                                    </label>

                                                    <select
                                                        value={item.menu_item_id || ''}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'menu_item_id',
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className={inputClass}
                                                    >
                                                        <option value="">
                                                            Select menu item
                                                        </option>

                                                        {menuItems.map((menu) => (
                                                            <option
                                                                key={menu.id}
                                                                value={menu.id}
                                                            >
                                                                {menu.menu_item_name} — ₱{Number(menu.item_price).toFixed(2)}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {errorFor(`items.${index}.menu_item_id`) && (
                                                        <p className="mt-1 text-xs text-red-500">
                                                            {errorFor(`items.${index}.menu_item_id`)}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className={labelClass}>
                                                        Quantity
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="1000"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'quantity',
                                                                Math.max(1, Number(e.target.value))
                                                            )
                                                        }
                                                        className={inputClass}
                                                    />

                                                    {errorFor(`items.${index}.quantity`) && (
                                                        <p className="mt-1 text-xs text-red-500">
                                                            {errorFor(`items.${index}.quantity`)}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="md:col-span-3">
                                                    <label className={labelClass}>
                                                        Subtotal
                                                    </label>

                                                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-purple-700">
                                                        ₱{subtotal.toFixed(2)}
                                                    </div>
                                                </div>

                                                <div className="md:col-span-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        disabled={(Array.isArray(form.data.items) ? form.data.items.length : 0) <= 1}
                                                        title="Remove item"
                                                        className="w-full rounded-xl border border-pink-100 bg-pink-50 px-3 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {errorFor('items') && (
                                <p className="mt-3 text-xs text-red-500">
                                    {errorFor('items')}
                                </p>
                            )}

                            <div className="mt-6 flex items-center justify-between rounded-xl bg-purple-50 p-5">
                                <span className="font-medium text-gray-700">
                                    Total Pre-Order Amount
                                </span>

                                <span className="text-2xl font-bold text-purple-700">
                                    ₱{totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </section>

                        {/* Payment */}
                        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Payment Information
                            </h2>

                            <p className="mb-5 mt-1 text-sm text-gray-500">
                                Enter the deposit amount paid by the customer.
                            </p>

                            <div className="max-w-md">
                                <label className={labelClass}>
                                    Deposit Paid (₱) *
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={String(form.data.deposit_paid ?? '')}
                                    onChange={(e) =>
                                        form.setData(
                                            'deposit_paid',
                                            Number(e.target.value)
                                        )
                                    }
                                    placeholder="0.00"
                                    className={inputClass}
                                />

                                {errorFor('deposit_paid') && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errorFor('deposit_paid')}
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* Form Actions */}
                        <div className="flex flex-col-reverse justify-end gap-3 pb-8 sm:flex-row">
                            <Link
                                href="/dashboard"
                                className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                            >
                                Back to Dashboard
                            </Link>

                            <Link
                                href="/reservations"
                                className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded-xl bg-purple-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {form.processing
                                    ? 'Saving Reservation...'
                                    : 'Save Reservation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
