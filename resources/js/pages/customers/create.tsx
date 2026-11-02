import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface CustomerForm extends Record<string, string> {
    customer_name: string;
    customer_number: string;
}

export default function Create() {
    const { data, setData, post, processing, errors, reset } =
        useForm<CustomerForm>({
            customer_name: '',
            customer_number: '',
        });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post('/customers', {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Add Customer" />

            <div className="min-h-screen bg-purple-50 px-6 py-10">
                <div className="mx-auto max-w-3xl">

                    {/* HEADER */}
                    <div className="mb-8">
                        <Link
                            href="/customers"
                            className="font-semibold text-purple-700 transition hover:text-pink-600"
                        >
                            ← Back to Customers
                        </Link>

                        <h1 className="mt-6 text-3xl font-bold text-purple-900">
                            Add New Customer
                        </h1>

                        <p className="mt-2 text-purple-600">
                            Register a new customer for your restaurant.
                        </p>
                    </div>

                    {/* FORM CARD */}
                    <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-lg">

                        <div className="border-b border-purple-100 bg-purple-100/70 px-8 py-5">
                            <h2 className="text-lg font-bold text-purple-900">
                                Customer Information
                            </h2>
                            <p className="mt-1 text-sm text-purple-600">
                                Please complete all required fields.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6 p-8">

                            {/* CUSTOMER NAME */}
                            <div>
                                <label
                                    htmlFor="customer_name"
                                    className="mb-2 block text-sm font-semibold text-purple-900"
                                >
                                    Customer Name
                                </label>

                                <input
                                    id="customer_name"
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) =>
                                        setData('customer_name', e.target.value)
                                    }
                                    placeholder="Enter customer name"
                                    required
                                    className="w-full rounded-xl border border-purple-200 bg-purple-50/50 px-4 py-3 text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                                />

                                {errors.customer_name && (
                                    <p className="mt-2 text-sm font-medium text-red-600">
                                        {errors.customer_name}
                                    </p>
                                )}
                            </div>

                            {/* CUSTOMER NUMBER */}
                            <div>
                                <label
                                    htmlFor="customer_number"
                                    className="mb-2 block text-sm font-semibold text-purple-900"
                                >
                                    Customer Number
                                </label>

                                <input
                                    id="customer_number"
                                    type="text"
                                    value={data.customer_number}
                                    onChange={(e) =>
                                        setData('customer_number', e.target.value)
                                    }
                                    placeholder="Enter customer number"
                                    required
                                    className="w-full rounded-xl border border-purple-200 bg-purple-50/50 px-4 py-3 text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                                />

                                {errors.customer_number && (
                                    <p className="mt-2 text-sm font-medium text-red-600">
                                        {errors.customer_number}
                                    </p>
                                )}
                            </div>

                            {/* BUTTONS */}
                            <div className="flex flex-col-reverse gap-3 border-t border-purple-100 pt-6 sm:flex-row sm:justify-end">

                                <Link
                                    href="/customers"
                                    className="rounded-xl border border-purple-200 px-6 py-3 text-center font-semibold text-purple-700 transition hover:bg-purple-50"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-purple-700 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Customer'}
                                </button>

                            </div>
                        </form>
                    </div>

                    {/* NOTE */}
                    <div className="mt-6 rounded-xl border border-pink-200 bg-pink-100/60 p-4">
                        <p className="text-sm text-purple-800">
                            <strong>Reminder:</strong> Make sure the customer name and number are correct before saving.
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}
