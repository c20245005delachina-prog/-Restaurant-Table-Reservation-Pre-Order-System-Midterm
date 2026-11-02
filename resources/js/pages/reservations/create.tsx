import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useMemo } from 'react';

type Customer = {
    id: number;
    customer_name: string;
    customer_number: string;
};

type RestaurantTable = {
    id: number;
    table_number: string | number;
    table_capacity: number;
};

type MenuItem = {
    id: number;
    name: string;
    category: string;
    price: number | string;
};

type OrderItem = {
    menu_item_id: string;
    quantity: number;
};

type ReservationForm = {
    customer_id: string;
    restaurant_table_id: string;
    reservation_time: string;
    party_size: number;
    deposit_paid: number;
    items: OrderItem[];
};

type Props = {
    customers: Customer[];
    tables: RestaurantTable[];
    menuItems: MenuItem[];
};

export default function CreateReservation({
    customers = [],
    tables = [],
    menuItems = [],
}: Props) {
    const { data, setData, post, processing, errors } =
        useForm<ReservationForm>({
            customer_id: '',
            restaurant_table_id: '',
            reservation_time: '',
            party_size: 1,
            deposit_paid: 0,
            items: [{ menu_item_id: '', quantity: 1 }],
        });

    const selectedTable = tables.find(
        (table) =>
            String(table.id) === String(data.restaurant_table_id),
    );

    const totalAmount = useMemo(() => {
        return data.items.reduce((total, item) => {
            const selectedItem = menuItems.find(
                (menuItem) =>
                    String(menuItem.id) === String(item.menu_item_id),
            );

            const price = Number(selectedItem?.price ?? 0);
            const quantity = Number(item.quantity) || 0;

            return total + price * quantity;
        }, 0);
    }, [data.items, menuItems]);

    const minimumDeposit = Math.round(totalAmount * 20) / 100;

    const peso = (amount: number) =>
        `₱${amount.toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const updateItem = (
        index: number,
        field: keyof OrderItem,
        value: string | number,
    ) => {
        const updatedItems = [...data.items];

        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        };

        setData('items', updatedItems);
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            { menu_item_id: '', quantity: 1 },
        ]);
    };

    const removeItem = (index: number) => {
        if (data.items.length <= 1) return;

        setData(
            'items',
            data.items.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/reservations');
    };

    return (
        <>
            <Head title="Create Reservation" />

            <div className="min-h-screen bg-pink-50 px-4 py-10 text-purple-950">
                <div className="mx-auto max-w-4xl">
                    {/* PAGE HEADER */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="mb-2 font-semibold text-purple-600">
                                RESTAURANT RESERVATION
                            </p>

                            <h1 className="text-3xl font-extrabold text-purple-800">
                                Create Reservation
                            </h1>

                            <p className="mt-2 text-purple-600">
                                Reserve your table and pre-order your
                                favorite meals.
                            </p>
                        </div>

                        <Link
                            href="/reservations"
                            className="rounded-lg border border-purple-200 bg-white px-4 py-2 font-semibold text-purple-700 transition hover:bg-pink-100"
                        >
                            ← Back to Reservations
                        </Link>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* 1. CUSTOMER INFORMATION */}
                        <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-800">
                                    1
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-purple-800">
                                        Customer Information
                                    </h2>
                                    <p className="text-sm text-purple-500">
                                        Choose your customer record.
                                    </p>
                                </div>
                            </div>

                            <label
                                htmlFor="customer_id"
                                className="mb-2 block font-semibold text-purple-900"
                            >
                                Select Customer
                            </label>

                            <select
                                id="customer_id"
                                value={data.customer_id}
                                onChange={(event) =>
                                    setData('customer_id', event.target.value)
                                }
                                className="w-full rounded-xl border border-purple-200 bg-white p-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                required
                            >
                                <option value="">Select customer</option>

                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.customer_name} —{' '}
                                        {customer.customer_number}
                                    </option>
                                ))}
                            </select>

                            {errors.customer_id && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.customer_id}
                                </p>
                            )}

                            {customers.length === 0 && (
                                <p className="mt-2 rounded-lg bg-pink-50 p-3 text-sm text-purple-700">
                                    No customers found. Please add a customer
                                    first.
                                </p>
                            )}
                        </section>

                        {/* 2. RESERVATION DETAILS */}
                        <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-800">
                                    2
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-purple-800">
                                        Reservation Details
                                    </h2>
                                    <p className="text-sm text-purple-500">
                                        Choose a table, date, and party size.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="restaurant_table_id"
                                        className="mb-2 block font-semibold text-purple-900"
                                    >
                                        Restaurant Table
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
                                        className="w-full rounded-xl border border-purple-200 bg-white p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                        required
                                    >
                                        <option value="">Select table</option>

                                        {tables.map((table) => (
                                            <option
                                                key={table.id}
                                                value={table.id}
                                            >
                                                Table {table.table_number} —
                                                Capacity: {table.table_capacity}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.restaurant_table_id && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.restaurant_table_id}
                                        </p>
                                    )}

                                    {tables.length === 0 && (
                                        <p className="mt-2 text-sm text-purple-600">
                                            No tables available. Add a
                                            restaurant table first.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="party_size"
                                        className="mb-2 block font-semibold text-purple-900"
                                    >
                                        Party Size
                                    </label>

                                    <input
                                        id="party_size"
                                        type="number"
                                        min="1"
                                        max={
                                            selectedTable?.table_capacity ??
                                            undefined
                                        }
                                        value={data.party_size}
                                        onChange={(event) =>
                                            setData(
                                                'party_size',
                                                Number(event.target.value),
                                            )
                                        }
                                        className="w-full rounded-xl border border-purple-200 p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                        required
                                    />

                                    {errors.party_size && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.party_size}
                                        </p>
                                    )}

                                    {selectedTable &&
                                        data.party_size >
                                            Number(selectedTable.table_capacity) && (
                                            <p className="mt-2 text-sm text-red-600">
                                                This table can accommodate only{' '}
                                                {selectedTable.table_capacity}{' '}
                                                people.
                                            </p>
                                        )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="reservation_time"
                                        className="mb-2 block font-semibold text-purple-900"
                                    >
                                        Reservation Date and Time
                                    </label>

                                    <input
                                        id="reservation_time"
                                        type="datetime-local"
                                        value={data.reservation_time}
                                        min={new Date(
                                            Date.now() -
                                                new Date().getTimezoneOffset() *
                                                    60000,
                                        )
                                            .toISOString()
                                            .slice(0, 16)}
                                        onChange={(event) =>
                                            setData(
                                                'reservation_time',
                                                event.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-purple-200 p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                        required
                                    />

                                    {errors.reservation_time && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.reservation_time}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* 3. PRE-ORDER MENU */}
                        <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-800">
                                        3
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold text-purple-800">
                                            Pre-Order Menu
                                        </h2>
                                        <p className="text-sm text-purple-500">
                                            Select menu items and quantities.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="rounded-xl bg-purple-700 px-4 py-2 font-semibold text-white transition hover:bg-purple-800"
                                >
                                    + Add Item
                                </button>
                            </div>

                            {menuItems.length === 0 && (
                                <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 text-purple-800">
                                    <p className="font-semibold">
                                        No menu items received.
                                    </p>
                                    <p className="mt-1 text-sm">
                                        Check the MenuItem model and
                                        ReservationController create method.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-5">
                                {data.items.map((item, index) => {
                                    const selectedMenuItem = menuItems.find(
                                        (menuItem) =>
                                            String(menuItem.id) ===
                                            String(item.menu_item_id),
                                    );

                                    const unitPrice = Number(
                                        selectedMenuItem?.price ?? 0,
                                    );

                                    const lineTotal =
                                        unitPrice *
                                        (Number(item.quantity) || 0);

                                    return (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-purple-100 bg-purple-50/40 p-4"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <h3 className="font-bold text-purple-800">
                                                    Item {index + 1}
                                                </h3>

                                                {data.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(index)
                                                        }
                                                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-pink-700 transition hover:bg-pink-100"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label
                                                        htmlFor={`menu_item_${index}`}
                                                        className="mb-2 block font-semibold text-purple-900"
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
                                                                event.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-purple-200 bg-white p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                                        required
                                                    >
                                                        <option value="">
                                                            Select menu item
                                                        </option>

                                                        {menuItems.map(
                                                            (menuItem) => (
                                                                <option
                                                                    key={
                                                                        menuItem.id
                                                                    }
                                                                    value={
                                                                        menuItem.id
                                                                    }
                                                                >
                                                                    {
                                                                        menuItem.name
                                                                    }{' '}
                                                                    (
                                                                    {
                                                                        menuItem.category
                                                                    }
                                                                    ) —{' '}
                                                                    {peso(
                                                                        Number(
                                                                            menuItem.price,
                                                                        ),
                                                                    )}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>

                                                    {errors[
                                                        `items.${index}.menu_item_id` as keyof typeof errors
                                                    ] && (
                                                        <p className="mt-2 text-sm text-red-600">
                                                            {
                                                                errors[
                                                                    `items.${index}.menu_item_id` as keyof typeof errors
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor={`quantity_${index}`}
                                                        className="mb-2 block font-semibold text-purple-900"
                                                    >
                                                        Quantity
                                                    </label>

                                                    <input
                                                        id={`quantity_${index}`}
                                                        type="number"
                                                        min="1"
                                                        max="1000"
                                                        value={item.quantity}
                                                        onChange={(event) =>
                                                            updateItem(
                                                                index,
                                                                'quantity',
                                                                Number(
                                                                    event.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-purple-200 bg-white p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-purple-100 pt-4 text-sm">
                                                <p className="text-purple-600">
                                                    Unit price:{' '}
                                                    <span className="font-bold text-purple-900">
                                                        {peso(unitPrice)}
                                                    </span>
                                                </p>

                                                <p className="text-purple-600">
                                                    Item total:{' '}
                                                    <span className="font-bold text-purple-800">
                                                        {peso(lineTotal)}
                                                    </span>
                                                </p>
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

                            <div className="mt-6 rounded-xl border border-pink-200 bg-pink-100 p-5 text-right">
                                <p className="text-sm font-medium text-purple-700">
                                    Pre-Order Total
                                </p>

                                <p className="mt-1 text-3xl font-extrabold text-purple-800">
                                    {peso(totalAmount)}
                                </p>
                            </div>
                        </section>

                        {/* 4. DEPOSIT PAYMENT */}
                        <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-800">
                                    4
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-purple-800">
                                        Deposit Payment
                                    </h2>
                                    <p className="text-sm text-purple-500">
                                        Enter the deposit for your pre-order.
                                    </p>
                                </div>
                            </div>

                            <div className="mb-5 rounded-xl bg-pink-100 p-4">
                                <p className="text-sm font-medium text-purple-700">
                                    Minimum Deposit (20%)
                                </p>

                                <p className="mt-1 text-2xl font-extrabold text-purple-800">
                                    {peso(minimumDeposit)}
                                </p>
                            </div>

                            <label
                                htmlFor="deposit_paid"
                                className="mb-2 block font-semibold text-purple-900"
                            >
                                Deposit Amount (₱)
                            </label>

                            <input
                                id="deposit_paid"
                                type="number"
                                min={minimumDeposit.toFixed(2)}
                                step="0.01"
                                value={data.deposit_paid}
                                onChange={(event) =>
                                    setData(
                                        'deposit_paid',
                                        Number(event.target.value),
                                    )
                                }
                                className="w-full rounded-xl border border-purple-200 p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                required
                            />

                            {errors.deposit_paid && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.deposit_paid}
                                </p>
                            )}

                            {data.deposit_paid < minimumDeposit && (
                                <p className="mt-2 text-sm text-pink-700">
                                    Deposit must be at least{' '}
                                    {peso(minimumDeposit)}.
                                </p>
                            )}
                        </section>

                        {/* FORM ACTIONS */}
                        <div className="flex flex-wrap justify-end gap-3 pb-8">
                            <Link
                                href="/reservations"
                                className="rounded-xl border border-purple-200 bg-white px-5 py-3 font-semibold text-purple-700 transition hover:bg-pink-100"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    customers.length === 0 ||
                                    tables.length === 0 ||
                                    menuItems.length === 0 ||
                                    data.items.some(
                                        (item) => !item.menu_item_id,
                                    ) ||
                                    data.deposit_paid < minimumDeposit ||
                                    (selectedTable !== undefined &&
                                        data.party_size >
                                            Number(
                                                selectedTable.table_capacity,
                                            ))
                                }
                                className="rounded-xl bg-purple-700 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Saving Reservation...'
                                    : 'Create Reservation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
