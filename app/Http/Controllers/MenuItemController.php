<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuItemController extends Controller
{
    public function index()
    {
        return Inertia::render('menu-items/index', [
            'menuItems' => MenuItem::latest()->paginate(10),
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
        ]);

        MenuItem::create($validated);

        return redirect()
            ->route('menu-items.index')
            ->with('success', 'Menu item added successfully!');
    }
}