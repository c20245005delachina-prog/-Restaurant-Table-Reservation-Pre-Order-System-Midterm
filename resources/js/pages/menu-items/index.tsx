import { Head, Link, router } from '@inertiajs/react';

interface MenuItem {
    id: number;
    name: string;
    category: string;
    price: string | number;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedMenuItems {
    data: MenuItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    menuItems: PaginatedMenuItems;
}

export default function Index({ menuItems }: Props) {

    return (
        <>
            <Head title="Menu Items" />

            <div className="min-h-screen bg-purple-50/50 p-4 md:p-8">
                <div className="mx-auto max-w-7xl">

                    {/* BACK TO DASHBOARD */}
                    <Link
                        href="/dashboard"
                        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-4 py-2 text-sm font-medium text-purple-700 shadow-sm transition hover:bg-purple-100"
                    >
                        ← Back to Dashboard
                    </Link>

                    {/* PAGE HEADER */}
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>
                            <h1 className="text-2xl font-bold text-purple-900">
                                Menu Items
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Manage your restaurant food items and prices.
                            </p>
                        </div>

                        <Link
                            href="/menu-items/create"
                            className="rounded-lg bg-purple-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-purple-700"
                        >
                            + Add Menu Item
                        </Link>

                    </div>

                    {/* SUCCESS MESSAGE */}
                    {/*
                        Laravel flash messages can be displayed here
                        if you share the flash prop through HandleInertiaRequests.
                    */}

                    {/* SUMMARY CARD */}
                    <div className="mb-6 rounded-xl border border-purple-100 bg-white p-5 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Total Menu Items
                        </p>

                        <p className="mt-2 text-3xl font-bold text-purple-700">
                            {menuItems.total}
                        </p>

                    </div>

                    {/* MENU ITEMS TABLE */}
                    <div className="overflow-hidden rounded-xl border border-purple-100 bg-white shadow-sm">

                        <div className="border-b border-purple-100 px-5 py-4">
                            <h2 className="font-semibold text-gray-800">
                                Menu List
                            </h2>
                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full text-left text-sm">

                                {/* TABLE HEADER */}
                                <thead className="bg-purple-50 text-gray-600">
                                    <tr>
                                        <th className="px-5 py-4">
                                            #
                                        </th>

                                        <th className="px-5 py-4">
                                            Menu Item
                                        </th>

                                        <th className="px-5 py-4">
                                            Category
                                        </th>

                                        <th className="px-5 py-4">
                                            Price
                                        </th>
                                    </tr>
                                </thead>

                                {/* TABLE BODY */}
                                <tbody className="divide-y divide-purple-50">

                                    {menuItems.data.length > 0 ? (

                                        menuItems.data.map((item, index) => (

                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-purple-50/50"
                                            >

                                                {/* NUMBER */}
                                                <td className="px-5 py-4 text-gray-500">
                                                    {(menuItems.current_page - 1) * 10 + index + 1}
                                                </td>

                                                {/* MENU ITEM NAME */}
                                                <td className="px-5 py-4 font-medium text-gray-800">
                                                    {item.name}
                                                </td>

                                                {/* CATEGORY */}
                                                <td className="px-5 py-4">
                                                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                                                        {item.category}
                                                    </span>
                                                </td>

                                                {/* PRICE */}
                                                <td className="px-5 py-4 font-semibold text-purple-700">
                                                    ₱{Number(item.price).toFixed(2)}
                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        /* EMPTY STATE */
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-5 py-12 text-center"
                                            >

                                                <div className="text-4xl">
                                                    🍽️
                                                </div>

                                                <p className="mt-3 font-semibold text-gray-700">
                                                    No menu items yet.
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Add your first restaurant menu item.
                                                </p>

                                                <Link
                                                    href="/menu-items/create"
                                                    className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                                                >
                                                    + Add Menu Item
                                                </Link>

                                            </td>
                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* PAGINATION */}
                        {menuItems.last_page > 1 && (

                            <div className="flex flex-wrap justify-center gap-2 border-t border-purple-100 p-4">

                                {menuItems.links.map((link, index) => (

                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => {
                                            if (link.url) {
                                                router.visit(link.url);
                                            }
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                            link.active
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                        } disabled:cursor-not-allowed disabled:opacity-40`}
                                    />

                                ))}

                            </div>

                        )}

                    </div>

                    {/* FOOTER */}
                    <p className="mt-5 text-center text-xs text-gray-400">
                        Restaurant Reservation Management System © 2026
                    </p>

                </div>
            </div>
        </>
    );
}
