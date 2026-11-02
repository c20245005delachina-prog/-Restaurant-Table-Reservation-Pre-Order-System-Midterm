
import { Head, Link, router } from '@inertiajs/react';

interface Customer {
    id: number;
    customer_name: string;
    customer_number: string;
    created_at: string;
}

interface Props {
    customers: Customer[];
}

export default function Index({ customers }: Props) {
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
                            className="rounded-xl bg-purple-700 px-6 py-3 text-center font-semibold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-purple-800"
                        >
                            + Add Customer
                        </Link>
                    </div>

                    {/* SUMMARY CARDS */}
                    <div className="mb-8 grid gap-5 sm:grid-cols-2">
                        <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                            <p className="text-sm font-medium text-purple-500">
                                Total Customers
                            </p>
                            <h2 className="mt-2 text-3xl font-bold text-purple-900">
                                {customers.length}
                            </h2>
                        </div>

                        <div className="rounded-2xl border border-pink-200 bg-pink-100/70 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                            <p className="text-sm font-medium text-pink-600">
                                Customer Records
                            </p>
                            <h2 className="mt-2 text-3xl font-bold text-purple-900">
                                {customers.length}
                            </h2>
                        </div>
                    </div>

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
                                    {customers.length > 0 ? (
                                        customers.map((customer) => (
                                            <tr
                                                key={customer.id}
                                                className="transition duration-200 hover:bg-pink-50"
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
                    </div>

                    {/* FOOTER LINK */}
                    <div className="mt-8">
                        <Link
                            href="/reservations"
                            className="font-semibold text-purple-700 transition hover:text-pink-600"
                        >
                            ← Back to Reservations
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}
