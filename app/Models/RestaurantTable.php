<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RestaurantTable extends Model
{
    protected $fillable = [
        'table_number',
        'table_capacity',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}