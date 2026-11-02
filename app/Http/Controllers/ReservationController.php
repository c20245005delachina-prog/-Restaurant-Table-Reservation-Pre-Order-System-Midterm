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
use Illuminate\Support\Facades\DB;
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
    public function index(): Response
    {
        $reservations = Reservation::query()
            ->with([
                'customer:id,customer_name,contact_number',
                'restaurantTable:id,table_number,table_capacity',
                'reservationItems.menuItem:id,menu_item_name,item_price',
            ])
            ->latest('reservation_time')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('reservations/index', [
            'reservations' => $reservations,
        ]);
    }

    /**
     * Show the form for creating a reservation.
     */
    public function create(): Response
    {
        return Inertia::render('reservations/create', [
            'customers' => Customer::query()
                ->select(['id', 'customer_name', 'customer_number'])
                ->orderBy('customer_name')
                ->get(),

            'tables' => RestaurantTable::query()
                ->select(['id', 'table_number', 'table_capacity'])
                ->orderBy('table_number')
                ->get(),

            'menuItems' => MenuItem::query()
                ->select([
                    'id',
                    'name',
                    'category',
                    'price',
                ])
                ->orderBy('name',)
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
            ->with('success', 'Reservation created successfully.');
    }

    /**
     * Display one reservation and its details.
     */
    public function show($id): Response
    {
        $reservation = Reservation::query()
            ->with([
                'customer',
                'restaurantTable',
                'reservationItems.menuItem',
            ])
            ->findOrFail($id);

        return Inertia::render('reservations/show', [
            'reservation' => $reservation,
        ]);
    }

    /**
     * Show the form for editing a reservation.
     */
    public function edit($id): Response
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
                ->select(['id', 'customer_name', 'customer_number'])
                ->orderBy('customer_name')
                ->get(),

            'tables' => RestaurantTable::query()
                ->select(['id', 'table_number', 'table_capacity'])
                ->orderBy('table_number')
                ->get(),

            'menuItems' => MenuItem::query()
                ->select([
                    'id',
                    'menu_item_name',
                    'item_category',
                    'item_price',
                ])
                ->orderBy('menu_item_name')
                ->get(),
        ]);
    }

    /**
     * Update an existing reservation.
     */
    public function update(
        UpdateReservationRequest $request,
        $id
    ): RedirectResponse {
        $this->service->updateReservation(
            $request->validated(),
            (int) $id
        );

        return to_route('reservations.index')
            ->with('success', 'Reservation updated successfully.');
    }

    /**
     * Delete a reservation and its pre-order items.
     */
    public function destroy($id): RedirectResponse
    {
        DB::transaction(function () use ($id) {
            $reservation = Reservation::query()->findOrFail($id);

            $reservation->reservationItems()->delete();

            $reservation->delete();
        });

        return to_route('reservations.index')
            ->with('success', 'Reservation cancelled successfully.');
    }
}
