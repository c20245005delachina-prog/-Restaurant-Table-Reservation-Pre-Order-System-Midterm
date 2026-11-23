import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface Customer {
    id: number;
    customer_name: string;
    contact_number: string;
    created_at?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCustomers {
    data: Customer[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface IndexProps {
    customers: PaginatedCustomers;
    filters?: {
        search?: string | null;
    };
}

export default function Index({ customers, filters }: IndexProps) {
    const [search, setSearch] = useState(filters?.search ?? '');

    // Search customers.
    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        router.get(
            '/customers',
            { search: search.trim() },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    // Clear search.
    const clearSearch = () => {
        setSearch('');

        router.get(
            '/customers',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    // Delete customer.
    const deleteCustomer = (customer: Customer) => {
        if (
            !window.confirm(
                `Are you sure you want to delete ${customer.customer_name}?`,
            )
        ) {
            return;
        }

        router.delete(`/customers/${customer.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Customer Management" />

            <div className="min-h-screen bg-gray-100 px-6 py-8">
                <div className="mx-auto max-w-7xl">

                    {/* PAGE HEADER */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                                Restaurant Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-gray-900">
                                Customer Management
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Manage your registered customers and their contact information.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/dashboard"
                                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/customers/create"
                                className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
                            >
                                + Add Customer
                            </Link>
                        </div>
                    </div>

                    {/* SUMMARY CARDS */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Customers
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                        {customers.total}
                                    </h2>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                                    👥
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Current Page
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                        {customers.current_page} / {customers.last_page}
                                    </h2>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                                    📋
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CUSTOMER TABLE CARD */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                        {/* TABLE HEADER AND SEARCH */}
                        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Registered Customers
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    View and manage customer records.
                                </p>
                            </div>

                            {/* SEARCH FORM */}
                            <form
                                onSubmit={handleSearch}
                                className="flex w-full flex-col gap-2 sm:max-w-lg sm:flex-row"
                            >
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search name or contact number..."
                                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-50"
                                />

                                <button
                                    type="submit"
                                    className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                                >
                                    Search
                                </button>

                                {search && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                                    >
                                        Clear
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* SEARCH RESULT INFORMATION */}
                        {filters?.search && (
                            <div className="border-b border-gray-100 bg-teal-50 px-6 py-3">
                                <p className="text-sm text-teal-800">
                                    Showing results for:
                                    <span className="ml-1 font-bold">
                                        "{filters.search}"
                                    </span>
                                    <span className="ml-2 text-teal-600">
                                        ({customers.total} records found)
                                    </span>
                                </p>
                            </div>
                        )}

                        {/* CUSTOMER TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            Contact Number
                                        </th>

                                        <th className="px-6 py-4 text-center font-semibold">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {customers.data.length > 0 ? (
                                        customers.data.map((customer) => (
                                            <tr
                                                key={customer.id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-700">
                                                            {customer.customer_name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {customer.customer_name}
                                                            </p>

                                                            <p className="text-xs text-gray-400">
                                                                Customer #{customer.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {customer.contact_number}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={`/customers/${customer.id}`}
                                                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                                                        >
                                                            View
                                                        </Link>

                                                        <Link
                                                            href={`/customers/${customer.id}/edit`}
                                                            className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-semibold text-gray-900 transition hover:bg-yellow-500"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteCustomer(customer)
                                                            }
                                                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-6 py-16 text-center"
                                            >
                                                <div className="text-4xl">
                                                    👥
                                                </div>

                                                <p className="mt-3 font-semibold text-gray-700">
                                                    No customers found
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Add a new customer or try a different search.
                                                </p>

                                                {filters?.search && (
                                                    <button
                                                        type="button"
                                                        onClick={clearSearch}
                                                        className="mt-4 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Clear Search
                                                    </button>
                                                )}

                                                <Link
                                                    href="/customers/create"
                                                    className="mt-4 ml-2 inline-block rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                                                >
                                                    + Add Customer
                                                </Link>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        {customers.links.length > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 px-6 py-4">
                                <p className="text-sm text-gray-500">
                                    Page {customers.current_page} of {customers.last_page}
                                </p>

                                <div className="flex flex-wrap gap-1">
                                    {customers.links.map((link, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.visit(link.url, {
                                                        preserveScroll: true,
                                                        preserveState: true,
                                                    });
                                                }
                                            }}
                                            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                                link.active
                                                    ? 'bg-teal-700 text-white'
                                                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                            } disabled:cursor-not-allowed disabled:opacity-40`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* INFORMATION NOTE */}
                    <div className="mt-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                        <span className="text-lg text-yellow-600">
                            !
                        </span>

                        <div>
                            <p className="text-sm font-bold text-gray-800">
                                Customer Records
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                                Keep customer information accurate and up to date.
                                Make sure to verify the contact number before saving changes.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
