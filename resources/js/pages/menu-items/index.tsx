
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

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
    per_page?: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    menuItems: PaginatedMenuItems;
    filters?: {
        search?: string;
    };
}

const peso = (price: number | string) =>
    `₱${Number(price).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

function paginationLabel(label: string) {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&')
        .replace(/<[^>]*>/g, '')
        .trim();
}

export default function Index({ menuItems, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const startNumber =
        menuItems.total === 0
            ? 0
            : (menuItems.current_page - 1) *
                  (menuItems.per_page ?? 10) +
              1;

    const endNumber = Math.min(
        menuItems.current_page * (menuItems.per_page ?? 10),
        menuItems.total,
    );

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.get(
            '/menu-items',
            { search: search.trim() },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const clearSearch = () => {
        setSearch('');

        router.get(
            '/menu-items',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Menu Items" />

            <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-7xl">

                    {/* PAGE HEADER */}
                    <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <Link
                                href="/dashboard"
                                className="mb-4 inline-flex items-center text-sm font-semibold text-teal-700 transition hover:text-teal-900"
                            >
                                Back to Dashboard
                            </Link>

                            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                                Restaurant Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-gray-950">
                                Menu Items
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Manage your restaurant food items, categories, and prices.
                            </p>
                        </div>

                        <Link
                            href="/menu-items/create"
                            className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                            + Add Menu Item
                        </Link>
                    </div>

                    {/* SUMMARY CARDS */}
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Menu Items
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-teal-800">
                                        {menuItems.total}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Matching restaurant food items
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                                    🍽️
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Current Page
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-gray-950">
                                        {menuItems.current_page} / {menuItems.last_page}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Menu item records displayed
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                                    📋
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* MENU LIST */}
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                        {/* CARD HEADER */}
                        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:p-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Registered Menu Items
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    View and manage your restaurant food items and prices.
                                </p>
                            </div>

                            <p className="text-sm text-gray-500">
                                Showing{' '}
                                <span className="font-semibold text-gray-900">
                                    {startNumber}–{endNumber}
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold text-gray-900">
                                    {menuItems.total}
                                </span>{' '}
                                items
                            </p>
                        </div>

                        {/* SEARCH */}
                        <div className="border-b border-gray-200 p-5 sm:p-6">
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col gap-3 sm:flex-row"
                            >
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search menu item, category, or price..."
                                    className="w-full flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                />

                                <button
                                    type="submit"
                                    className="rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                                >
                                    Search
                                </button>

                                {filters?.search && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                                    >
                                        Clear
                                    </button>
                                )}
                            </form>

                            {filters?.search && (
                                <p className="mt-3 text-sm text-gray-500">
                                    Search results for:{' '}
                                    <span className="font-semibold text-teal-700">
                                        "{filters.search}"
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* TABLE */}
                        <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-[650px] text-left text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        <th className="px-5 py-4">#</th>
                                        <th className="px-5 py-4">Menu Item</th>
                                        <th className="px-5 py-4">Category</th>
                                        <th className="px-5 py-4">Price</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {menuItems.data.length > 0 ? (
                                        menuItems.data.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="px-5 py-4 text-gray-500">
                                                    {startNumber + index}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="font-semibold text-gray-900">
                                                        {item.name}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                                                        {item.category}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 font-bold text-gray-900">
                                                    {peso(item.price)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-5 py-14 text-center"
                                            >
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-3xl">
                                                    🍽️
                                                </div>

                                                <h3 className="mt-4 font-bold text-gray-900">
                                                    {filters?.search
                                                        ? 'No matching menu items found'
                                                        : 'No menu items yet'}
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {filters?.search
                                                        ? 'Try another menu item name, category, or price.'
                                                        : 'Add your first restaurant menu item to get started.'}
                                                </p>

                                                {filters?.search ? (
                                                    <button
                                                        type="button"
                                                        onClick={clearSearch}
                                                        className="mt-5 inline-flex rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                                                    >
                                                        Clear Search
                                                    </button>
                                                ) : (
                                                    <Link
                                                        href="/menu-items/create"
                                                        className="mt-5 inline-flex rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                                                    >
                                                        + Add Menu Item
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        {menuItems.last_page > 1 && (
                            <div className="flex flex-col justify-between gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center">
                                <p className="text-sm text-gray-500">
                                    Page {menuItems.current_page} of {menuItems.last_page}
                                </p>

                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    {menuItems.links.map((link, index) => (
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
                                            className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                                                link.active
                                                    ? 'border-teal-700 bg-teal-700 text-white'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:bg-yellow-50 hover:border-yellow-400'
                                            } disabled:cursor-not-allowed disabled:opacity-40`}
                                        >
                                            {paginationLabel(link.label)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* FOOTER */}
                    <footer className="mt-6 pb-4 text-center text-xs text-gray-400">
                        Restaurant Table Reservation &amp; Pre-Order System © 2026
                    </footer>
                </div>
            </main>
        </AppLayout>
    );
}
