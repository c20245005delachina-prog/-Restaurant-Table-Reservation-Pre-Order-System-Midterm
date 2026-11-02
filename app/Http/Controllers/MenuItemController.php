<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuItemController extends Controller
{
    /**
     * Display all menu items.
     */
    public function index()
    {
        $menuItems = MenuItem::select([
            'id',
            'name',
            'category',
            'price',
        ])
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('menu-items/index', [
            'menuItems' => $menuItems,
        ]);
    }

    /**
     * Show the form for creating a menu item.
     */
    public function create()
    {
        return Inertia::render('menu-items/create');
    }

    /**
     * Save a new menu item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        MenuItem::create($validated);

        return redirect()
            ->route('menu-items.index')
            ->with('success', 'Menu item created successfully.');
    }

    /**
     * Display a specific menu item.
     */
    public function show(MenuItem $menuItem)
    {
        return Inertia::render('menu-items/show', [
            'menuItem' => $menuItem,
        ]);
    }

    /**
     * Show the form for editing a menu item.
     */
    public function edit(MenuItem $menuItem)
    {
        return Inertia::render('menu-items/edit', [
            'menuItem' => $menuItem,
        ]);
    }

    /**
     * Update a menu item.
     */
    public function update(Request $request, MenuItem $menuItem)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        $menuItem->update($validated);

        return redirect()
            ->route('menu-items.index')
            ->with('success', 'Menu item updated successfully.');
    }

    /**
     * Delete a menu item.
     */
    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();

        return redirect()
            ->route('menu-items.index')
            ->with('success', 'Menu item deleted successfully.');
    }
}
