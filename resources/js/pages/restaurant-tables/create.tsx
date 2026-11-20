
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        table_number: '',
        table_capacity: 2,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post('/restaurant-tables');
    }

    const inputStyle =
        'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100';

    return (
        <AppLayout>
            <Head title="Add Restaurant Table" />

            <main className="min-h-screen bg-gray-100 px-4 py-8 text-slate-800 sm:px-8">
                <div className="mx-auto max-w-4xl">

                    <div className="mb-6">
                        <Link
                            href="/restaurant-tables"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-900"
                        >
                            ← Back to Restaurant Tables
                        </Link>
                    </div>

                    <header className="mb-7">
                        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-teal-700">
                            Reservation Management
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Add Restaurant Table
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Create a new seating space for your restaurant.
                        </p>
                    </header>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                                    🪑
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Restaurant Table Information
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Fill in the seating details below.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6 p-6 sm:p-8">

                            <div>
                                <label
                                    htmlFor="table_number"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Table Number <span className="text-red-500">*</span>
                                </label>

                                <input
                                    id="table_number"
                                    name="table_number"
                                    type="text"
                                    value={data.table_number}
                                    onChange={(event) =>
                                        setData('table_number', event.target.value)
                                    }
                                    placeholder="e.g. 1 or A1"
                                    autoComplete="off"
                                    required
                                    aria-invalid={Boolean(errors.table_number)}
                                    className={inputStyle}
                                />

                                {errors.table_number ? (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.table_number}
                                    </p>
                                ) : (
                                    <p className="mt-2 text-sm text-slate-400">
                                        Enter a unique number or label for this table.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="table_capacity"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Seating Capacity <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <input
                                        id="table_capacity"
                                        name="table_capacity"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={data.table_capacity}
                                        onChange={(event) =>
                                            setData(
                                                'table_capacity',
                                                Number(event.target.value)
                                            )
                                        }
                                        required
                                        aria-invalid={Boolean(errors.table_capacity)}
                                        className={`${inputStyle} pr-20`}
                                    />

                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-teal-700">
                                        seats
                                    </span>
                                </div>

                                {errors.table_capacity ? (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.table_capacity}
                                    </p>
                                ) : (
                                    <p className="mt-2 text-sm text-slate-400">
                                        Enter the maximum number of people this table can seat.
                                    </p>
                                )}
                            </div>

                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                <div className="flex gap-3">
                                    <span className="text-xl">💡</span>

                                    <p className="text-sm leading-6 text-slate-700">
                                        <strong>Tip:</strong> Use a unique table number and
                                        set the correct seating capacity so reservations
                                        can be assigned appropriately.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                                <Link
                                    href="/restaurant-tables"
                                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : '+ Save Table'}
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
