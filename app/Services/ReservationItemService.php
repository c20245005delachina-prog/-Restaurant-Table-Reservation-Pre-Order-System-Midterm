<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Models\Reservation;
use App\Models\ReservationItem;
use Illuminate\Support\Facades\DB;

class ReservationItemService
{
    public function addItem(
        int $reservationId,
        array $data
    ): ReservationItem {
        return DB::transaction(function () use ($reservationId, $data) {
            $reservation = Reservation::findOrFail($reservationId);

            $menuItem = MenuItem::findOrFail($data['menu_item_id']);

            return $reservation->reservationItems()->create([
                'menu_item_id' => $menuItem->id,
                'quantity' => $data['quantity'],
                'unit_price' => $menuItem->price,
            ]);
        });
    }

    public function updateItem(
        array $data,
        int $id
    ): ReservationItem {
        $item = ReservationItem::findOrFail($id);

        $menuItem = MenuItem::findOrFail($data['menu_item_id']);

        $item->update([
            'menu_item_id' => $menuItem->id,
            'quantity' => $data['quantity'],
            'unit_price' => $menuItem->price,
        ]);

        return $item->refresh();
    }

    public function deleteItem(int $id): void
    {
        ReservationItem::findOrFail($id)->delete();
    }
}
