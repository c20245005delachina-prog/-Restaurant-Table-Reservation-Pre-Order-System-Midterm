
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Customer {
    id: number;
    customer_name: string;
    contact_number: string;
}

interface EditProps {
    customer: Customer;
}

interface CustomerForm extends Record<string, string> {
    customer_name: string;
    contact_number: string;
}

export default function Edit({ customer }: EditProps) {
    const { data, setData, put, processing, errors, transform } =
        useForm<CustomerForm>({
            customer_name: customer.customer_name ?? '',
            contact_number: customer.contact_number ?? '',
        });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        transform((formData) => ({
            customer_name: formData.customer_name.trim(),
            contact_number: formData.contact_number.trim(),
        }));

        put(`/customers/${customer.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Customer" />

            <div className="min-h-screen bg-gray-100 px-6 py-8">
                <div className="mx-auto max-w-5xl">

                    {/* PAGE HEADER */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                                Customer Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-gray-900">
                                Edit Customer
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Update the customer's contact information.
                            </p>
                        </div>

                        <Link
                            href="/customers"
                            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            ← Back to Customers
                        </Link>
                    </div>

                    {/* FORM CARD */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                        {/* CARD HEADER */}
                        <div className="flex items-center gap-4 border-b border-gray-200 px-6 py-5 sm:px-8">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.86 4.49 2.65 2.65M4 20l4.5-1 11-11a2 2 0 0 0-2.8-2.8l-11 11L4 20Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Customer Information
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Edit the details for this customer.
                                </p>
                            </div>
                        </div>

                        {/* FORM */}
                        <form onSubmit={submit} className="space-y-6 p-6 sm:p-8">

                            {/* CUSTOMER NAME */}
                            <div>
                                <label
                                    htmlFor="customer_name"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Customer Name
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <input
                                    id="customer_name"
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) =>
                                        setData('customer_name', e.target.value)
                                    }
                                    placeholder="Enter customer name"
                                    maxLength={255}
                                    autoComplete="name"
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-50"
                                />

                                {errors.customer_name && (
                                    <p className="mt-2 text-sm font-medium text-red-600">
                                        {errors.customer_name}
                                    </p>
                                )}
                            </div>

                            {/* CONTACT NUMBER */}
                            <div>
                                <label
                                    htmlFor="contact_number"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Contact Number
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <input
                                    id="contact_number"
                                    type="tel"
                                    value={data.contact_number}
                                    onChange={(e) =>
                                        setData('contact_number', e.target.value)
                                    }
                                    placeholder="Enter contact number"
                                    maxLength={30}
                                    autoComplete="tel"
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-50"
                                />

                                {errors.contact_number && (
                                    <p className="mt-2 text-sm font-medium text-red-600">
                                        {errors.contact_number}
                                    </p>
                                )}
                            </div>

                            {/* FORM ACTIONS */}
                            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                                <Link
                                    href="/customers"
                                    className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Customer'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* INFORMATION NOTE */}
                    <div className="mt-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                        <span className="text-lg text-yellow-600">!</span>

                        <div>
                            <p className="text-sm font-bold text-gray-800">
                                Important Reminder
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                Please verify the updated customer information before saving your changes.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
