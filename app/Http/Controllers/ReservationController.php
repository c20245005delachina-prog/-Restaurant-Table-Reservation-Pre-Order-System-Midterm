<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Models\Customer;
use App\Models\MenuItem;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use App\Services\ReservationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function __construct(
        private ReservationService $service
    ) {}

    /**
     * Display all reservations.
     */
    public function index(Request $request): Response
    {
        $search = trim(strip_tags(
            $request->string('search')->toString()
        ));

        $reservations = Reservation::query()
            ->with([
                'customer:id,customer_name,contact_number',
                'restaurantTable:id,table_number,table_capacity',
                'reservationItems.menuItem:id,name,category,price',
            ])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->whereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery
                            ->where('customer_name', 'like', "%{$search}%")
                            ->orWhere('contact_number', 'like', "%{$search}%");
                    });
                });
            })
            ->latest('reservation_time')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('reservations/index', [
            'reservations' => $reservations,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the reservation creation form.
     */
    public function create(): Response
    {
        return Inertia::render('reservations/create', [
            'customers' => Customer::query()
                ->select(['id', 'customer_name', 'contact_number'])
                ->orderBy('customer_name')
                ->get(),

            'tables' => RestaurantTable::query()
                ->select(['id', 'table_number', 'table_capacity'])
                ->orderBy('table_number')
                ->get(),

            'menuItems' => MenuItem::query()
                ->select([
                    'id',
                    'name as menu_item_name',
                    'category as item_category',
                    'price as item_price',
                ])
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a new reservation.
     */
    public function store(
        StoreReservationRequest $request
    ): RedirectResponse {
        $this->service->createReservation(
            $request->validated()
        );

        return to_route('reservations.index')
            ->with('success', 'Reservation saved successfully!');
    }

    /**
     * Display a specific reservation.
     */
    public function show(int $id): Response
    {
        $reservation = Reservation::query()
            ->with([
                'customer:id,customer_name,contact_number',
                'restaurantTable:id,table_number,table_capacity',
                'reservationItems.menuItem:id,name,category,price',
            ])
            ->findOrFail($id);

        return Inertia::render('reservations/show', [
            'reservation' => $reservation,
        ]);
    }

    /**
     * Show the reservation editing form.
     */
    public function edit(int $id): Response
    {
        $reservation = Reservation::query()
            ->with([
                'customer',
                'restaurantTable',
                'reservationItems.menuItem',
            ])
            ->findOrFail($id);

        return Inertia::render('reservations/edit', [
            'reservation' => $reservation,

            'customers' => Customer::query()
                ->select(['id', 'customer_name', 'contact_number'])
                ->orderBy('customer_name')
                ->get(),

            'tables' => RestaurantTable::query()
                ->select(['id', 'table_number', 'table_capacity'])
                ->orderBy('table_number')
                ->get(),

            'menuItems' => MenuItem::query()
                ->select([
                    'id',
                    'name as menu_item_name',
                    'category as item_category',
                    'price as item_price',
                ])
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Update an existing reservation.
     */
    public function update(
        UpdateReservationRequest $request,
        int $id
    ): RedirectResponse {
        $reservation = Reservation::query()->findOrFail($id);

        $this->service->updateReservation(
            $reservation,
            $request->validated()
        );

        return to_route('reservations.index')
            ->with('success', 'Reservation updated successfully.');
    }

    /**
     * Delete a reservation.
     */
    public function destroy(int $id): RedirectResponse
    {
        $reservation = Reservation::query()->findOrFail($id);

        $reservation->delete();

        return to_route('reservations.index')
            ->with('success', 'Reservation cancelled successfully.');
    }
}
