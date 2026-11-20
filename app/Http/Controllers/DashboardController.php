<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            // Dashboard statistics
            'totalReservations' => Reservation::count(),

            'totalCustomers' => Customer::count(),

            'totalTables' => RestaurantTable::count(),

            'totalDeposits' => number_format(
                (float) Reservation::sum('deposit_paid'),
                2,
                '.',
                ''
            ),

            // Five most recent reservations
            'recentReservations' => Reservation::query()
                ->select([
                    'id',
                    'customer_id',
                    'restaurant_table_id',
                    'reservation_time',
                    'party_size',
                    'total_amount',
                    'deposit_paid',
                ])
                ->with([
                    'customer:id,customer_name,contact_number',
                    'restaurantTable:id,table_number,table_capacity',
                ])
                ->latest('reservation_time')
                ->take(5)
                ->get(),
        ]);
    }
}
