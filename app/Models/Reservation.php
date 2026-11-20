<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'restaurant_table_id',
        'reservation_time',
        'party_size',
        'total_amount',
        'deposit_paid',
    ];

    protected function casts(): array
    {
        return [
            'reservation_time' => 'datetime',
            'party_size' => 'integer',
            'total_amount' => 'decimal:2',
            'deposit_paid' => 'decimal:2',
        ];
    }

    // A reservation belongs to one customer.
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    // A reservation belongs to one restaurant table.
    public function restaurantTable(): BelongsTo
    {
        return $this->belongsTo(RestaurantTable::class);
    }

    // A reservation can have multiple pre-order items.
    public function reservationItems(): HasMany
    {
        return $this->hasMany(ReservationItem::class);
    }
}
