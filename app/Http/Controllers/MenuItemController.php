<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Models\MenuItem;
use App\Services\MenuItemService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuItemController extends Controller
{
    protected MenuItemService $menuItemService;

    public function __construct(MenuItemService $menuItemService)
    {
        $this->menuItemService = $menuItemService;
    }

    public function index(Request $request): Response
    {
        $search = $request->query('search');

        return Inertia::render('menu-items/index', [
            'menuItems' => $this->menuItemService->paginate($search, 10),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('menu-items/create');
    }

    public function store(StoreMenuItemRequest $request): RedirectResponse
    {
        $this->menuItemService->createMenuItem($request->validated());

        return redirect()->route('menu-items.index')
            ->with('success', 'Menu item created successfully.');
    }

    public function update(
        UpdateMenuItemRequest $request,
        MenuItem $menuItem
    ): RedirectResponse {
        $this->menuItemService->updateMenuItem(
            $request->validated(),
            $menuItem->id
        );

        return redirect()->route('menu-items.index')
            ->with('success', 'Menu item updated successfully.');
    }
}
