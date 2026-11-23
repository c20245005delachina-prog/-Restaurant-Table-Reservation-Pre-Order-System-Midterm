<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRestaurantTableRequest;
use App\Http\Requests\UpdateRestaurantTableRequest;
use App\Models\RestaurantTable;
use App\Services\ReservationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RestaurantTableController extends Controller
{
    public function __construct(
        private ReservationService $service
    ) {}

    /**
     * Display restaurant tables with search and pagination.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $tables = RestaurantTable::query()
            ->withCount('reservations')
            ->when($search, function ($query, $search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where(
                        'table_number',
                        'like',
                        "%{$search}%"
                    )->orWhere(
                        'table_capacity',
                        'like',
                        "%{$search}%"
                    );
                });
            })
            ->orderBy('table_number')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('restaurant-tables/index', [
            'tables' => $tables,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a restaurant table.
     */
    public function create(): Response
    {
        return Inertia::render('restaurant-tables/create');
    }

    /**
     * Store a new restaurant table.
     */
    public function store(
        StoreRestaurantTableRequest $request
    ): RedirectResponse {
        $this->service->createRestaurantTable(
            $request->validated()
        );

        return to_route('restaurant-tables.index')
            ->with('success', 'Restaurant table created successfully.');
    }

    /**
     * Update an existing restaurant table.
     */
    public function update(
        UpdateRestaurantTableRequest $request,
        RestaurantTable $restaurantTable
    ): RedirectResponse {
        $this->service->updateRestaurantTable(
            $restaurantTable,
            $request->validated()
        );

        return to_route('restaurant-tables.index')
            ->with('success', 'Restaurant table updated successfully.');
    }
}
