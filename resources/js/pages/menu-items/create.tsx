
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: '',
        price: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const price = Number(data.price);

        if (
            data.price.trim() === '' ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            return;
        }

        post('/menu-items');
    };

    const inputStyle =
        'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100';

    return (
        <AppLayout>
            <Head title="Add Menu Item" />

            <main className="min-h-screen bg-gray-100 px-4 py-8 text-slate-800 sm:px-8">
                <div className="mx-auto max-w-4xl">

                    <div className="mb-6">
                        <Link
                            href="/menu-items"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-900"
                        >
                            ← Back to Menu Items
                        </Link>
                    </div>

                    <header className="mb-7">
                        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-teal-700">
                            Restaurant Management
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Add Menu Item
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Add a new food or drink to your restaurant's pre-order menu.
                        </p>
                    </header>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                                    🍽️
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Menu Item Information
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Fill in the details below.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6 p-6 sm:p-8">

                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Food Name <span className="text-red-500">*</span>
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    placeholder="Example: Chicken Adobo"
                                    className={inputStyle}
                                    required
                                />

                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="category"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Food Category <span className="text-red-500">*</span>
                                </label>

                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(event) =>
                                        setData('category', event.target.value)
                                    }
                                    className={inputStyle}
                                    required
                                >
                                    <option value="">Select food category</option>
                                    <option value="Appetizer">Appetizer</option>
                                    <option value="Main Course">Main Course</option>
                                    <option value="Side Dish">Side Dish</option>
                                    <option value="Dessert">Dessert</option>
                                    <option value="Beverage">Beverage</option>
                                </select>

                                {errors.category && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="price"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Item Price (₱) <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-teal-700">
                                        ₱
                                    </span>

                                    <input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(event) =>
                                            setData('price', event.target.value)
                                        }
                                        placeholder="0.00"
                                        className={`${inputStyle} pl-10`}
                                        required
                                    />
                                </div>

                                <p className="mt-1 text-xs text-slate-400">
                                    Enter the menu item's price in Philippine pesos.
                                </p>

                                {errors.price && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                <div className="flex gap-3">
                                    <span className="text-xl">💡</span>

                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            Menu Item Reminder
                                        </p>

                                        <p className="mt-1 text-sm text-slate-600">
                                            Check the food name, category, and price before saving.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                                <Link
                                    href="/menu-items"
                                    className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-teal-700 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : '+ Save Menu Item'}
                                </button>
                            </div>
                        </form>
                    </section>

                    <footer className="py-7 text-center text-sm text-slate-400">
                        Restaurant Reservation &amp; Pre-Order System © 2026
                    </footer>
                </div>
            </main>
        </AppLayout>
    );
}
