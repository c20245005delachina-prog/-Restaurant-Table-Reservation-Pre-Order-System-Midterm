<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // OPTIMIZATION:
        // Combines four dashboard statistics into one database query.
        // Scalar subqueries retrieve only aggregate values instead of
        // loading complete records from each table.
        $statistics = DB::query()
            ->selectRaw('
                (SELECT COUNT(*) FROM reservations) AS total_reservations,
                (SELECT COUNT(*) FROM customers) AS total_customers,
                (SELECT COUNT(*) FROM restaurant_tables) AS total_tables,
                (SELECT COALESCE(SUM(deposit_paid), 0) FROM reservations) AS total_deposits
            ')
            ->first();

        return Inertia::render('dashboard', [

            // Uses the combined aggregate query to obtain reservation count.
            'totalReservations' => (int) $statistics->total_reservations,

            // Uses the combined aggregate query to obtain customer count.
            'totalCustomers' => (int) $statistics->total_customers,

            // Uses the combined aggregate query to obtain restaurant table count.
            'totalTables' => (int) $statistics->total_tables,

            // Uses the combined aggregate query to calculate total deposits.
            'totalDeposits' => number_format(
                (float) $statistics->total_deposits,
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
