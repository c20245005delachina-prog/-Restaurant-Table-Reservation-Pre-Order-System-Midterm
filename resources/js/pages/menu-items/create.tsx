import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Customer {
    id: number;
    customer_name: string;
    customer_number: string;
}

interface MenuItem {
    id: number;
    name: string;
    category: string;
    price: number | string;
}

interface RestaurantTable {
    id: number;
    table_number: string | number;
    table_capacity: number;
}

interface Props {
    customers: Customer[];
    menuItems: MenuItem[];
    restaurantTables: RestaurantTable[];
}

export default function Create({
    customers,
    menuItems,
    restaurantTables,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        menu_item_id: '',
        restaurant_table_id: '',
        reservation_date: '',
        reservation_time: '',
        number_of_guests: '1',
        notes: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/reservations');
    }

    return (
        <>
            <Head title="Create Reservation" />

            <div className="min-h-screen bg-purple-50 px-4 py-10">
                <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
                    <Link
                        href="/menu-items"
                        className="mb-6 inline-block font-semibold text-purple-700 hover:text-pink-600"
                    >
                        ← Back to Menu Items
                    </Link>

                    <h1 className="mb-2 text-3xl font-bold text-purple-900">
                        Create Reservation
                    </h1>

                    <p className="mb-8 text-gray-600">
                        Fill in the details below to make a reservation.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer */}
                        <div>
                            <label
                                htmlFor="customer_id"
                                className="mb-2 block font-semibold text-gray-700"
                            >
                                Customer
                            </label>

                            <select
                                id="customer_id"
                                value={data.customer_id}
                                onChange={(e) =>
                                    setData('customer_id', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 p-3"
                                required
                            >
                                <option value="">Select customer</option>

                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.customer_name} — {customer.customer_number}
                                    </option>
                                ))}
                            </select>

                            {errors.customer_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.customer_id}
                                </p>
                            )}
                        </div>

                        {/* Menu Item */}
                        <div>
                            <label
                                htmlFor="menu_item_id"
                                className="mb-2 block font-semibold text-gray-700"
                            >
                                Menu Item
                            </label>

                            <select
                                id="menu_item_id"
                                value={data.menu_item_id}
                                onChange={(e) =>
                                    setData('menu_item_id', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 p-3"
                                required
                            >
                                <option value="">Select menu item</option>

                                {menuItems.map((menu) => (
                                    <option
                                        key={menu.id}
                                        value={menu.id}
                                    >
                                        {menu.name} — ₱
                                        {Number(menu.price).toFixed(2)}
                                    </option>
                                ))}
                            </select>

                            {errors.menu_item_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.menu_item_id}
                                </p>
                            )}
                        </div>

                        {/* Restaurant Table */}
                        <div>
                            <label
                                htmlFor="restaurant_table_id"
                                className="mb-2 block font-semibold text-gray-700"
                            >
                                Restaurant Table
                            </label>

                            <select
                                id="restaurant_table_id"
                                value={data.restaurant_table_id}
                                onChange={(e) =>
                                    setData(
                                        'restaurant_table_id',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 p-3"
                                required
                            >
                                <option value="">Select table</option>

                                {restaurantTables.map((table) => (
                                    <option
                                        key={table.id}
                                        value={table.id}
                                    >
                                        Table {table.table_number} — Capacity:{' '}
                                        {table.table_capacity}
                                    </option>
                                ))}
                            </select>

                            {errors.restaurant_table_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.restaurant_table_id}
                                </p>
                            )}
                        </div>

                        {/* Reservation Date */}
                        <div>
                            <label
                                htmlFor="reservation_date"
                                className="mb-2 block font-semibold text-gray-700"
                            >
                                Reservation Date
                            </label>

                            <input
                                id="reservation_date"
                                type="date"
                                value={data.reservation_date}
                                onChange={(e) =>
                                    setData('reservation_date', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 p-3"
                                required
                            />

                            {errors.reservation_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.reservation_date}
                                </p>
                            )}
                        </div>

                        {/* Reservation Time */}
                        <div>
                            <label
                                htmlFor="reservation_time"
                                className="mb-2 block font-semibold text-gray-700"
                            >
                                Reservation Time
                            </label>

                            <input
                                id="reservation_time"
                                type="time"
                                value={data.reservation_time}
                                onChange={(e) =>
                                    setData('reservation_time', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 p-3"
                                required
                            />

                            {errors.reservation_time && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.reservation_time}
                                </p>
                            )}
                        </div>

                        {/* Number of Guests */}
                        <div>
                            <label
                                htmlFor="number_of_guests"
                                className="mb-2 block font-semibold text-gray-700"
                            >
                                Number of Guests
                            </label>

                            <input
                                id="number_of_guests"
                                type="number"
                                min="1"
                                value={data.number_of_guests}
                                onChange={(e) =>
                                    setData('number_of_guests', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 p-3"
                                required
                            />

                            {errors.number_of_guests && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.number_of_guests}
                                </p>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <label
                                htmlFor="notes"
                                className="mb-2 block font-semibold text-gray-700"
                            >
                                Notes (Optional)
                            </label>

                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 p-3"
                                placeholder="Any special requests?"
                            />

                            {errors.notes && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing
                                ? 'Creating Reservation...'
                                : 'Create Reservation'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}