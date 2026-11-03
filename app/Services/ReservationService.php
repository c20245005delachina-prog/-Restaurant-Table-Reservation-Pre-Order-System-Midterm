<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\MenuItem;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReservationService
{
    private function cleanText(string $value): string
    {
        return trim(preg_replace('/\s+/u', ' ', strip_tags($value)) ?? '');
    }

    private function cleanPhone(string $value): string
    {
        $value = trim($value);
        $hasPlus = str_starts_with($value, '+');
        $digits = preg_replace('/\D+/', '', $value) ?? '';

        return ($hasPlus ? '+' : '') . $digits;
    }

    private function money(float $amount): float
    {
        return round($amount, 2);
    }

    private function prepareItems(array $items): array
    {
        $prepared = [];
        $totalCents = 0;

        foreach ($items as $item) {
            $menuItem = MenuItem::query()
                ->lockForUpdate()
                ->findOrFail($item['menu_item_id']);

            // Store menu item names in title case.
            $name = mb_convert_case(
                $this->cleanText($menuItem->name),
                MB_CASE_TITLE,
                'UTF-8'
            );

            $menuItem->name = $name;
            $menuItem->save();

            $quantity = (int) $item['quantity'];
            $unitPriceCents = (int) round(
                (float) $menuItem->price * 100
            );

            $totalCents += $unitPriceCents * $quantity;

            $prepared[] = [
                'menu_item_id' => $menuItem->id,
                'quantity' => $quantity,
                'unit_price' => $unitPriceCents / 100,
            ];
        }

        return [
            'items' => $prepared,
            'total' => $totalCents / 100,
        ];
    }

    private function checkCapacity(
        RestaurantTable $table,
        int $partySize
    ): void {
        if ($partySize > $table->table_capacity) {
            throw ValidationException::withMessages([
                'party_size' =>
                    "Party size cannot exceed this table's capacity of "
                    . $table->table_capacity . '.',
            ]);
        }
    }

    private function checkDeposit(float $deposit, float $total): void
    {
        $minimumCents = (int) ceil($total * 100 * 0.20 - 0.000001);
        $depositCents = (int) round($deposit * 100);

        if ($depositCents < $minimumCents) {
            throw ValidationException::withMessages([
                'deposit_paid' => sprintf(
                    'The minimum 20%% deposit is %.2f.',
                    $minimumCents / 100
                ),
            ]);
        }
    }

    public function createReservation(array $data): Reservation
    {
        return DB::transaction(function () use ($data) {
            $table = RestaurantTable::query()
                ->lockForUpdate()
                ->findOrFail($data['restaurant_table_id']);

            $partySize = (int) $data['party_size'];
            $this->checkCapacity($table, $partySize);

            $prepared = $this->prepareItems($data['items']);
            $total = $prepared['total'];
            $deposit = $this->money((float) $data['deposit_paid']);

            $this->checkDeposit($deposit, $total);

           $phone = $this->cleanPhone($data['contact_number']);

        $customer = Customer::firstOrCreate(
    [
        'contact_number' => $phone,
    ],
    [
        'customer_name' => $this->cleanText(
            $data['customer_name']
        ),
        'customer_number' => $phone,
    ]
);

            $customer->customer_name = $this->cleanText(
                $data['customer_name']
            );
            $customer->save();

            $reservation = Reservation::create([
                'customer_id' => $customer->id,
                'restaurant_table_id' => $table->id,
                'reservation_time' => $data['reservation_time'],
                'party_size' => $partySize,
                'total_amount' => $total,
                'deposit_paid' => $deposit,
            ]);

            $reservation->reservationItems()->createMany(
                $prepared['items']
            );

            return $reservation->load([
                'customer',
                'restaurantTable',
                'reservationItems.menuItem',
            ]);
        });
    }

    public function updateReservation(
        array $data,
        int $id
    ): Reservation {
        return DB::transaction(function () use ($data, $id) {
            $reservation = Reservation::query()
                ->lockForUpdate()
                ->findOrFail($id);

            $customer = $reservation->customer;
            $customerData = [];

            if (array_key_exists('customer_name', $data)) {
                $customerData['customer_name'] = $this->cleanText(
                    $data['customer_name']
                );
            }

            if (array_key_exists('contact_number', $data)) {
                $customerData['contact_number'] = $this->cleanPhone(
                    $data['contact_number']
                );
            }

            if ($customerData) {
                $customer->fill($customerData)->save();
            }

            $tableId = $data['restaurant_table_id']
                ?? $reservation->restaurant_table_id;

            $table = RestaurantTable::query()
                ->lockForUpdate()
                ->findOrFail($tableId);

            $partySize = (int) (
                $data['party_size'] ?? $reservation->party_size
            );

            $this->checkCapacity($table, $partySize);

            if (array_key_exists('items', $data)) {
                $prepared = $this->prepareItems($data['items']);
                $total = $prepared['total'];
            } else {
                $total = (float) $reservation->total_amount;
            }

            $deposit = $this->money((float) (
                $data['deposit_paid'] ?? $reservation->deposit_paid
            ));

            $this->checkDeposit($deposit, $total);

            $reservation->update([
                'restaurant_table_id' => $table->id,
                'reservation_time' => $data['reservation_time']
                    ?? $reservation->reservation_time,
                'party_size' => $partySize,
                'total_amount' => $total,
                'deposit_paid' => $deposit,
            ]);

            if (array_key_exists('items', $data)) {
                $reservation->reservationItems()->delete();
                $reservation->reservationItems()->createMany(
                    $prepared['items']
                );
            }

            return $reservation->fresh([
                'customer',
                'restaurantTable',
                'reservationItems.menuItem',
            ]);
        });
    }

    public function createRestaurantTable(array $data): RestaurantTable
    {
        return RestaurantTable::create([
            'table_number' => $this->cleanText($data['table_number']),
            'table_capacity' => (int) $data['table_capacity'],
        ]);
    }

    public function updateRestaurantTable(
        array $data,
        int $id
    ): RestaurantTable {
        return DB::transaction(function () use ($data, $id) {
            $table = RestaurantTable::query()
                ->lockForUpdate()
                ->findOrFail($id);

            $capacity = (int) $data['table_capacity'];

            $hasOversizedFutureBooking = $table->reservations()
                ->where('reservation_time', '>', now())
                ->where('party_size', '>', $capacity)
                ->exists();

            if ($hasOversizedFutureBooking) {
                throw ValidationException::withMessages([
                    'table_capacity' =>
                        'Capacity cannot be reduced below an existing future reservation.',
                ]);
            }

            $table->update([
                'table_number' => $this->cleanText($data['table_number']),
                'table_capacity' => $capacity,
            ]);

            return $table;
        });
    }
}
