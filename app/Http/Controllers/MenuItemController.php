<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Services\MenuItemService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuItemController extends Controller
{
    protected MenuItemService $menuItemService;

    public function __construct(MenuItemService $menuItemService)
    {
        $this->menuItemService = $menuItemService;
    }

    public function index(Request $request)
    {
        return Inertia::render('menu-items/index', [
            'menuItems' => $this->menuItemService->paginate(
                $request->input('search'),
                10
            ),
        ]);
    }

    public function create()
    {
        return Inertia::render('menu-items/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
        ], [
            'name.required' => 'Please enter the menu item name.',
            'category.required' => 'Please select a food category.',
            'price.required' => 'Please enter the item price.',
            'price.numeric' => 'The price must be a valid number.',
            'price.min' => 'The price cannot be negative.',
        ]);

        $this->menuItemService->createMenuItem($validated);

        return redirect()
            ->route('menu-items.index')
            ->with('success', 'Menu item added successfully!');
    }
}
