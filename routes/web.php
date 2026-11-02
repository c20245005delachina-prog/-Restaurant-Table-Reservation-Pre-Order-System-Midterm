<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RestaurantTableController;
use App\Http\Controllers\MenuItemController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('customers', CustomerController::class);
    Route::resource('restaurant-tables', RestaurantTableController::class);
    Route::resource('reservations', ReservationController::class);
    Route::resource('menu-items', MenuItemController::class);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';