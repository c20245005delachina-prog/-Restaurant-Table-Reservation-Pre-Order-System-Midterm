import { Head, Link, router } from '@inertiajs/react';

interface MenuItem {
    id: number;
    name: string;
    category: string;
    price: string | number;
    created_at: string;
}

interface PaginatedMenuItems {
    data: MenuItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Props {
    menuItems: PaginatedMenuItems;
}

export default function Index({ menuItems }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this menu item?')) {
            router.delete(`/menu-items/${id}`);
        }
    };

    return <>
            <Head title="Menu Items" />

            <div className="min-h-screen bg-purple-50 p-6 md:p-10">
                <div className="mx-auto max-w-7xl">

                    {/* Header */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-purple-900">
                                Menu Items
                            </h1>
                            <p className="mt-2 text-purple-600">
                                Manage your restaurant menu and prices.
                            </p>
                        </div>

                        <Link
                            href="/menu-items/create"
                            className="rounded-xl bg-purple-600 px-5 py-3 text-center font-semibold text-white shadow-md transition hover:bg-purple-700"
                        >
                            + Add Menu Item
                        </Link>
                    </div>

                    {/* Summary */}
                    <div className="mb-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-purple-500">
                            Total Menu Items
                        </p>
                        <p className="mt-2 text-3xl font-bold text-purple-900">
                            {menuItems.total}
                        </p>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-purple-100 text-purple-900">
                                    <tr>
                                        <th className="px-6 py-4">#</th>
                                        <th className="px-6 py-4">Menu Item</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-purple-100">
                                    {menuItems.data.length > 0 ? (
                                        menuItems.data.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-purple-50"
                                            >
                                                <td className="px-6 py-4 text-gray-500">
                                                    {(menuItems.current_page - 1) * 10 + index + 1}
                                                </td>

                                                <td className="px-6 py-4 font-semibold text-gray-800">
                                                    {item.name}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-700">
                                                        {item.category}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 font-semibold text-purple-700">
                                                    ₱{Number(item.price).toFixed(2)}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            href={`/menu-items/${item.id}/edit`}
                                                            className="rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-200"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(item.id)}
                                                            className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-200"
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
                                                colSpan={5}
                                                className="px-6 py-12 text-center"
                                            >
                                                <p className="text-lg font-semibold text-purple-800">
                                                    No menu items yet.
                                                </p>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Click Add Menu Item to create your first menu item.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {menuItems.last_page > 1 && (
                            <div className="flex flex-wrap justify-center gap-2 border-t border-purple-100 p-4">
                                {menuItems.links.map((link, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                            link.active
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                        } disabled:cursor-not-allowed disabled:opacity-40`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="mt-6">
                        <Link
                            href="/"
                            className="font-medium text-purple-600"
                        >
                            Back
                        </Link>
                    </div>
                </div>
            </div>
        </>;
    }