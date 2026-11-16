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
            'totalReservations' => Reservation::count(),
            'totalCustomers' => Customer::count(),
            'totalTables' => RestaurantTable::count(),
            'totalDeposits' => Reservation::sum('deposit_paid'),

            'recentReservations' => Reservation::with([
                'customer',
                'restaurantTable',
            ])
                ->latest('reservation_time')
                ->take(5)
                ->get(),
        ]);
    }
}