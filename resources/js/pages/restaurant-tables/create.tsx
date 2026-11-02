
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        table_number: '',
        table_capacity: 2,
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post('/restaurant-tables');
    }

    return (
        <>
            <Head title="Add Restaurant Table" />

            <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 px-4 py-8 text-slate-800 sm:px-8">
                <div className="mx-auto max-w-3xl">
                    {/* Back Link */}
                    <Link
                        href="/restaurant-tables"
                        className="inline-flex items-center gap-2 font-semibold text-purple-700 transition hover:text-pink-600"
                    >
                        <span aria-hidden="true">←</span>
                        Back to Restaurant Tables
                    </Link>

                    {/* Form Card */}
                    <section className="mt-6 overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl shadow-purple-100/60">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 px-6 py-8 text-white sm:px-10">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl shadow-inner">
                                    🪑
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-100">
                                        Reservation Management
                                    </p>

                                    <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                                        Add Restaurant Table
                                    </h1>

                                    <p className="mt-2 text-sm text-purple-100">
                                        Create a new seating space for your restaurant.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-7 p-6 sm:p-10">
                            {/* Table Number */}
                            <div>
                                <label
                                    htmlFor="table_number"
                                    className="mb-2 block text-sm font-bold text-slate-700"
                                >
                                    Table Number
                                    <span className="ml-1 text-pink-500">*</span>
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
                                    aria-describedby={
                                        errors.table_number
                                            ? 'table-number-error'
                                            : 'table-number-help'
                                    }
                                    className={`w-full rounded-xl border bg-white px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                                        errors.table_number
                                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                                            : 'border-purple-200 focus:border-purple-500 focus:ring-purple-100'
                                    }`}
                                />

                                {errors.table_number ? (
                                    <p
                                        id="table-number-error"
                                        role="alert"
                                        className="mt-2 text-sm font-medium text-red-600"
                                    >
                                        {errors.table_number}
                                    </p>
                                ) : (
                                    <p
                                        id="table-number-help"
                                        className="mt-2 text-sm text-slate-500"
                                    >
                                        Enter a unique number or label for this table.
                                    </p>
                                )}
                            </div>

                            {/* Seating Capacity */}
                            <div>
                                <label
                                    htmlFor="table_capacity"
                                    className="mb-2 block text-sm font-bold text-slate-700"
                                >
                                    Seating Capacity
                                    <span className="ml-1 text-pink-500">*</span>
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
                                        aria-describedby={
                                            errors.table_capacity
                                                ? 'table-capacity-error'
                                                : 'table-capacity-help'
                                        }
                                        className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-20 text-slate-800 outline-none transition focus:ring-4 ${
                                            errors.table_capacity
                                                ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                                                : 'border-purple-200 focus:border-purple-500 focus:ring-purple-100'
                                        }`}
                                    />

                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-purple-500">
                                        seats
                                    </span>
                                </div>

                                {errors.table_capacity ? (
                                    <p
                                        id="table-capacity-error"
                                        role="alert"
                                        className="mt-2 text-sm font-medium text-red-600"
                                    >
                                        {errors.table_capacity}
                                    </p>
                                ) : (
                                    <p
                                        id="table-capacity-help"
                                        className="mt-2 text-sm text-slate-500"
                                    >
                                        Enter the maximum number of people this table can seat.
                                    </p>
                                )}
                            </div>

                            {/* Information */}
                            <div className="flex gap-3 rounded-xl border border-pink-100 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                                <span className="text-xl" aria-hidden="true">
                                    💡
                                </span>

                                <p className="text-sm leading-6 text-purple-800">
                                    <strong>Tip:</strong> Use a unique table number and
                                    set the correct seating capacity so reservations can
                                    be assigned appropriately.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-purple-100 pt-6 sm:flex-row sm:justify-end">
                                <Link
                                    href="/restaurant-tables"
                                    className="inline-flex items-center justify-center rounded-xl border border-purple-200 px-6 py-3 font-semibold text-purple-700 transition hover:border-purple-300 hover:bg-purple-50"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-7 py-3 font-bold text-white shadow-lg shadow-purple-200 transition duration-300 hover:-translate-y-0.5 hover:from-purple-700 hover:to-pink-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <span className="animate-spin">◌</span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span aria-hidden="true">＋</span>
                                            Save Table
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>

                    <footer className="py-8 text-center text-sm text-purple-400">
                        💜 Restaurant Reservation &amp; Pre-Order System
                    </footer>
                </div>
            </main>
        </>
    );
}
