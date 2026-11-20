<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\MenuItem;

class ReservationItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'menu_item_id',
        'quantity',
        'unit_price',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
        ];
    }

    // A reservation item belongs to one reservation.
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    // A reservation item belongs to one menu item.
    public function menuItem(): BelongsTo
{
    return $this->belongsTo(MenuItem::class, 'menu_item_id');
}
}
