import { Head, Link, router } from '@inertiajs/react';

type MenuItem = {
    id: number;
    name: string;
    category: string;
    price: number | string;
};

type Props = {
    menuItems: {
        data: MenuItem[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

export default function Index({ menuItems }: Props) {
    function deleteItem(id: number) {
        if (confirm('Are you sure you want to delete this menu item?')) {
            router.delete(`/menu-items/${id}`);
        }
    }

    return (
        <>
            <Head title="Menu Items" />

            <div className="min-h-screen bg-purple-50 p-6 text-purple-950 md:p-10">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-purple-600">
                                Restaurant Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold">
                                Menu Items
                            </h1>

                            <p className="mt-2 text-purple-700">
                                Manage the food and drinks customers can pre-order.
                            </p>
                        </div>

                        <Link
                            href="/menu-items/create"
                            className="rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white shadow hover:bg-purple-800"
                        >
                            + Add Menu Item
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
                        <div className="border-b border-purple-100 p-5">
                            <h2 className="text-xl font-bold">
                                Pre-Order Menu
                            </h2>

                            <p className="mt-1 text-sm text-purple-600">
                                Food items, categories, and prices
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-purple-100 text-sm text-purple-900">
                                    <tr>
                                        <th className="px-5 py-4">Food Name</th>
                                        <th className="px-5 py-4">Category</th>
                                        <th className="px-5 py-4">Price</th>
                                        <th className="px-5 py-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-purple-100">
                                    {menuItems.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-5 py-12 text-center"
                                            >
                                                <p className="font-semibold">
                                                    No menu items yet.
                                                </p>

                                                <p className="mt-2 text-sm text-purple-600">
                                                    Add your first food item to the pre-order menu.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        menuItems.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-purple-50"
                                            >
                                                <td className="px-5 py-4 font-semibold">
                                                    {item.name}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                                                        {item.category}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 font-semibold text-purple-700">
                                                    ₱{Number(item.price).toFixed(2)}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/menu-items/${item.id}/edit`}
                                                            className="rounded-lg border border-purple-200 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteItem(item.id)
                                                            }
                                                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-purple-100 p-4">
                            {menuItems.links.map((link, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url && router.visit(link.url)
                                    }
                                    className={`rounded-lg px-3 py-2 text-sm ${
                                        link.active
                                            ? 'bg-purple-700 text-white'
                                            : 'border border-purple-200 text-purple-700 hover:bg-purple-100'
                                    } disabled:opacity-40`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            href="/reservations"
                            className="font-semibold text-purple-700 hover:underline"
                        >
                            ← Back to Reservations
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}