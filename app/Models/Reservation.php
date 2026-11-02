<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reservation extends Model
{
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
            'total_amount' => 'decimal:2',
            'deposit_paid' => 'decimal:2',
            'party_size' => 'integer',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function restaurantTable(): BelongsTo
    {
        return $this->belongsTo(RestaurantTable::class);
    }

    public function reservationItems(): HasMany
    {
        return $this->hasMany(ReservationItem::class);
    }
}