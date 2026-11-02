<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRestaurantTableRequest;
use App\Http\Requests\UpdateRestaurantTableRequest;
use App\Models\RestaurantTable;
use App\Services\ReservationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RestaurantTableController extends Controller
{
    public function __construct(
        private ReservationService $service
    ) {}

    public function index(): Response
    {
        $tables = RestaurantTable::query()
            ->withCount('reservations')
            ->orderBy('table_number')
            ->paginate(10);

        return Inertia::render('restaurant-tables/index', [
            'tables' => $tables,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('restaurant-tables/create');
    }

    public function store(
        StoreRestaurantTableRequest $request
    ): RedirectResponse {
        $this->service->createRestaurantTable(
            $request->validated()
        );

        return to_route('restaurant-tables.index')
            ->with('success', 'Restaurant table created successfully.');
    }

    public function update(
        UpdateRestaurantTableRequest $request,
        $id
    ): RedirectResponse {
        $this->service->updateRestaurantTable(
            $request->validated(),
            (int) $id
        );

        return to_route('restaurant-tables.index')
            ->with('success', 'Restaurant table updated successfully.');
    }
}