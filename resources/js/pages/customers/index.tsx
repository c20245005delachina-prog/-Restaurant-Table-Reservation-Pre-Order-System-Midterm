
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Customer {
    id: number;
    customer_name: string;
    customer_number: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCustomers {
    data: Customer[];
    links: PaginationLink[];
    total: number;
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

interface Props {
    customers: PaginatedCustomers;
    filters: {
        search: string;
    };
}

export default function Index({ customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const searchCustomers = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        router.get(
            '/customers',
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const deleteCustomer = (id: number) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            router.delete(`/customers/${id}`);
        }
    };

    return (
        <>
            <Head title="Customer Management" />

            <div className="min-h-screen bg-purple-50 px-6 py-10">
                <div className="mx-auto max-w-6xl">

                    {/* HEADER */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-purple-900">
                                Customer Management
                            </h1>
                            <p className="mt-2 text-purple-600">
                                Manage your restaurant customers.
                            </p>
                        </div>

                        <Link
                            href="/customers/create"
                            className="rounded-xl bg-purple-700 px-6 py-3 text-center font-semibold text-white shadow-md transition hover:-translate-y-1 hover:bg-purple-800"
                        >
                            + Add Customer
                        </Link>
                    </div>

                    {/* SUMMARY CARD */}
                    <div className="mb-8 grid gap-5 sm:grid-cols-2">
                        <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-purple-500">
                                Total Customers
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-purple-900">
                                {customers.total}
                            </h2>
                        </div>

                        <div className="rounded-2xl border border-pink-200 bg-pink-100/70 p-6 shadow-sm">
                            <p className="text-sm font-medium text-pink-600">
                                Current Page Records
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-purple-900">
                                {customers.data.length}
                            </h2>
                        </div>
                    </div>

                    {/* SEARCH */}
                    <form
                        onSubmit={searchCustomers}
                        className="mb-6 flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search customer name or number..."
                            className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-purple-900 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        />

                        <button
                            type="submit"
                            className="rounded-xl bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-800"
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                router.get('/customers');
                            }}
                            className="rounded-xl border border-purple-200 px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-100"
                        >
                            Clear
                        </button>
                    </form>

                    {/* CUSTOMER TABLE */}
                    <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-lg">
                        <div className="border-b border-purple-100 bg-purple-100/70 px-6 py-5">
                            <h2 className="text-lg font-bold text-purple-900">
                                Customer List
                            </h2>

                            <p className="mt-1 text-sm text-purple-600">
                                View and manage registered customers.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-purple-50 text-sm font-semibold text-purple-800">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Customer Name</th>
                                        <th className="px-6 py-4">Customer Number</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-purple-100">
                                    {customers.data.length > 0 ? (
                                        customers.data.map((customer) => (
                                            <tr
                                                key={customer.id}
                                                className="transition hover:bg-pink-50"
                                            >
                                                <td className="px-6 py-4 text-purple-600">
                                                    #{customer.id}
                                                </td>

                                                <td className="px-6 py-4 font-semibold text-purple-900">
                                                    {customer.customer_name}
                                                </td>

                                                <td className="px-6 py-4 text-purple-700">
                                                    {customer.customer_number}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap justify-center gap-2">
                                                        <Link
                                                            href={`/customers/${customer.id}/edit`}
                                                            className="rounded-lg bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-200"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => deleteCustomer(customer.id)}
                                                            className="rounded-lg bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-200"
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
                                                colSpan={4}
                                                className="px-6 py-12 text-center"
                                            >
                                                <p className="text-lg font-semibold text-purple-800">
                                                    No Customers Yet
                                                </p>

                                                <p className="mt-2 text-sm text-purple-500">
                                                    Click Add Customer to register your first customer.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-purple-100 px-6 py-5 sm:flex-row">
                            <p className="text-sm text-purple-600">
                                Showing {customers.from ?? 0} to {customers.to ?? 0} of {customers.total} customers
                            </p>

                            <div className="flex flex-wrap justify-center gap-2">
                                {customers.links.map((link, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => {
                                            if (link.url) {
                                                router.get(
                                                    link.url,
                                                    {},
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    }
                                                );
                                            }
                                        }}
                                        className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                                            link.active
                                                ? 'bg-purple-700 text-white'
                                                : 'border border-purple-200 bg-white text-purple-700 hover:bg-purple-50'
                                        } disabled:cursor-not-allowed disabled:opacity-40`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FOOTER LINKS */}
                    <div className="mt-8 flex flex-wrap justify-between gap-4">
                        <Link
                            href="/dashboard"
                            className="font-semibold text-purple-700 transition hover:text-pink-600"
                        >
                            ← Back to Dashboard
                        </Link>

                        <Link
                            href="/reservations"
                            className="font-semibold text-purple-700 transition hover:text-pink-600"
                        >
                            Go to Reservations →
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}
