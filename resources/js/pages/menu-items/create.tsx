import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: '',
        price: '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post('/menu-items', {
            onSuccess: () => {
                // Laravel redirects to the menu list.
            },
        });
    };

    const inputStyle =
        'w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-purple-950 outline-none transition placeholder:text-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100';

    return (
        <>
            <Head title="Add Menu Item" />

            <div className="min-h-screen bg-purple-50 px-6 py-10">
                <div className="mx-auto max-w-4xl">

                    <Link
                        href="/menu-items"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-900"
                    >
                        ← Back to Menu Items
                    </Link>

                    <div className="mb-8 mt-7">
                        <p className="text-sm font-bold uppercase tracking-widest text-purple-600">
                            Restaurant Management
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-purple-950">
                            Add Menu Item
                        </h1>

                        <p className="mt-2 text-purple-600">
                            Add a new food or drink to your restaurant's pre-order menu.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">

                        <div className="border-b border-purple-100 px-7 py-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                                    🍽️
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-purple-950">
                                        Menu Item Information
                                    </h2>

                                    <p className="mt-1 text-sm text-purple-500">
                                        Fill in the details below.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6 p-7">

                            {/* MENU ITEM NAME */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-semibold text-purple-950"
                                >
                                    Food Name *
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
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

                            {/* CATEGORY */}
                            <div>
                                <label
                                    htmlFor="category"
                                    className="mb-2 block text-sm font-semibold text-purple-950"
                                >
                                    Food Category *
                                </label>

                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                    className={inputStyle}
                                    required
                                >
                                    <option value="">
                                        Select food category
                                    </option>
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

                            {/* PRICE */}
                            <div>
                                <label
                                    htmlFor="price"
                                    className="mb-2 block text-sm font-semibold text-purple-950"
                                >
                                    Item Price (₱) *
                                </label>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-purple-500">
                                        ₱
                                    </span>

                                    <input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        placeholder="0.00"
                                        className={`${inputStyle} pl-10`}
                                        required
                                    />
                                </div>

                                {errors.price && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            {/* REMINDER */}
                            <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                                <div className="flex gap-3">
                                    <span className="text-xl">💡</span>

                                    <div>
                                        <p className="font-semibold text-purple-900">
                                            Menu Item Reminder
                                        </p>

                                        <p className="mt-1 text-sm text-purple-600">
                                            Make sure the food name, category, and price are correct before saving.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex flex-col-reverse justify-end gap-3 border-t border-purple-100 pt-6 sm:flex-row">

                                <Link
                                    href="/menu-items"
                                    className="rounded-xl border border-purple-200 px-7 py-3 text-center font-semibold text-purple-700 hover:bg-purple-50"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-purple-700 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Saving Menu Item...'
                                        : '+ Save Menu Item'}
                                </button>

                            </div>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-sm text-purple-400">
                        Restaurant Management System © 2026
                    </p>

                </div>
            </div>
        </>
    );
}
