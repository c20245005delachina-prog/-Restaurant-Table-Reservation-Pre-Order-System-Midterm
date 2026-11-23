<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\MenuItem;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReservationService
{
    /*
    |--------------------------------------------------------------------------
    | Text Sanitization
    |--------------------------------------------------------------------------
    */

    /**
     * Remove HTML tags and normalize whitespace.
     */
    private function cleanText(?string $value): string
    {
        $value = strip_tags($value ?? '');

        return preg_replace('/\s+/', ' ', trim($value)) ?? '';
    }

    /**
     * Sanitize contact numbers.
     */
    private function cleanPhone(?string $value): string
    {
        $value = trim(strip_tags($value ?? ''));

        $hasPlus = str_starts_with($value, '+');

        $phone = preg_replace('/\D+/', '', $value) ?? '';

        return ($hasPlus ? '+' : '').$phone;
    }

    /*
    |--------------------------------------------------------------------------
    | Numeric Sanitization
    |--------------------------------------------------------------------------
    */

    /**
     * Sanitize and validate monetary values.
     */
    private function money($value): float
    {
        if (! is_numeric($value)) {
            throw ValidationException::withMessages([
                'deposit_paid' => 'Please enter a valid monetary amount.',
            ]);
        }

        $amount = round((float) $value, 2);

        if (! is_finite($amount) || $amount < 0) {
            throw ValidationException::withMessages([
                'deposit_paid' => 'The amount cannot be negative or invalid.',
            ]);
        }

        return $amount;
    }

    /**
     * Sanitize positive integer values.
     */
    private function positiveInteger($value, string $field): int
    {
        $filtered = filter_var($value, FILTER_VALIDATE_INT);

        if ($filtered === false || $filtered < 1) {
            throw ValidationException::withMessages([
                $field => 'Please enter a valid positive whole number.',
            ]);
        }

        return $filtered;
    }

    /*
    |--------------------------------------------------------------------------
    | Customer Management
    |--------------------------------------------------------------------------
    */

    /**
     * Find an existing customer or create a new one.
     */
    private function findOrCreateCustomer(
        string $name,
        string $phone
    ): Customer {

        // Use Laravel Str::title() to normalize customer names.
        $name = Str::title($this->cleanText($name));

        $phone = $this->cleanPhone($phone);

        $customer = Customer::firstOrCreate(
            ['contact_number' => $phone],
            ['customer_name' => $name]
        );

        // Update the existing customer name if it has changed.
        if ($customer->customer_name !== $name) {
            $customer->update([
                'customer_name' => $name,
            ]);
        }

        return $customer;
    }

    /*
    |--------------------------------------------------------------------------
    | Prepare Reservation Menu Items
    |--------------------------------------------------------------------------
    */

    /**
     * Sanitize menu item IDs and quantities.
     * Calculate totals using current database menu prices.
     */
    private function prepareItems(array $items): array
    {
        if (empty($items)) {
            throw ValidationException::withMessages([
                'items' => 'Please select at least one menu item.',
            ]);
        }

        $preparedItems = [];
        $totalCents = 0;
        $validatedItems = [];

        // Validate IDs and quantities before querying the database.
        foreach ($items as $index => $item) {
            $menuItemId = $this->positiveInteger(
                $item['menu_item_id'] ?? null,
                "items.{$index}.menu_item_id"
            );

            $quantity = $this->positiveInteger(
                $item['quantity'] ?? null,
                "items.{$index}.quantity"
            );

            $validatedItems[] = [
                'menu_item_id' => $menuItemId,
                'quantity' => $quantity,
                'index' => $index,
            ];
        }

        // Retrieve all selected menu items in one query.
        $menuItems = MenuItem::query()
            ->whereIn(
                'id',
                array_column($validatedItems, 'menu_item_id')
            )
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        foreach ($validatedItems as $item) {
            $menuItem = $menuItems->get($item['menu_item_id']);

            if (! $menuItem) {
                throw ValidationException::withMessages([
                    "items.{$item['index']}.menu_item_id" => 'The selected menu item does not exist.',
                ]);
            }

            $price = (float) $menuItem->price;

            if (! is_finite($price) || $price < 0) {
                throw ValidationException::withMessages([
                    "items.{$item['index']}.menu_item_id" => 'The selected menu item has an invalid price.',
                ]);
            }

            // Convert prices to cents to avoid floating-point
            // arithmetic errors when calculating totals.
            $unitPriceCents = (int) round($price * 100);

            $totalCents += $unitPriceCents * $item['quantity'];

            $preparedItems[] = [
                'menu_item_id' => $menuItem->id,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPriceCents / 100,
            ];
        }

        return [
            'items' => $preparedItems,
            'total' => $totalCents / 100,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Reservation Validation
    |--------------------------------------------------------------------------
    */

    /**
     * Check whether the selected table can accommodate the guests.
     */
    private function checkCapacity(
        RestaurantTable $table,
        int $partySize
    ): void {
        if ($partySize > (int) $table->table_capacity) {
            throw ValidationException::withMessages([
                'party_size' => 'The selected table cannot accommodate this number of guests.',
            ]);
        }
    }

    /**
     * Validate the required deposit.
     */
    private function checkDeposit(float $deposit, float $total): void
    {
        if ($deposit < 0 || $deposit > $total) {
            throw ValidationException::withMessages([
                'deposit_paid' => 'The deposit cannot be negative or greater than the total amount.',
            ]);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Create Reservation
    |--------------------------------------------------------------------------
    */

    public function createReservation(array $data): Reservation
    {
        return DB::transaction(function () use ($data) {

            // Sanitize customer information.
            $customerName = $this->cleanText(
                $data['customer_name'] ?? ''
            );

            $customerPhone = $this->cleanPhone(
                $data['contact_number'] ?? ''
            );

            if ($customerName === '') {
                throw ValidationException::withMessages([
                    'customer_name' => 'Please enter the customer name.',
                ]);
            }

            if ($customerPhone === '') {
                throw ValidationException::withMessages([
                    'contact_number' => 'Please enter the contact number.',
                ]);
            }

            // Lock the selected restaurant table.
            $tableId = $this->positiveInteger(
                $data['restaurant_table_id'] ?? null,
                'restaurant_table_id'
            );

            $table = RestaurantTable::whereKey($tableId)
                ->lockForUpdate()
                ->firstOrFail();

            // Validate party size.
            $partySize = $this->positiveInteger(
                $data['party_size'] ?? null,
                'party_size'
            );

            $this->checkCapacity($table, $partySize);

            // Prepare menu items and calculate total.
            $prepared = $this->prepareItems(
                $data['items'] ?? []
            );

            $total = $prepared['total'];

            // Sanitize deposit.
            $deposit = $this->money(
                $data['deposit_paid'] ?? 0
            );

            $this->checkDeposit($deposit, $total);

            // Find or create customer.
            $customer = $this->findOrCreateCustomer(
                $customerName,
                $customerPhone
            );

            // Create reservation.
            $reservation = Reservation::create([
                'customer_id' => $customer->id,
                'restaurant_table_id' => $table->id,
                'reservation_time' => $data['reservation_time'],
                'party_size' => $partySize,
                'total_amount' => $total,
                'deposit_paid' => $deposit,
            ]);

            // Save reservation items in a batch.
            $reservation->reservationItems()->createMany(
                $prepared['items']
            );

            // Eager load related records.
            return $reservation->load([
                'customer',
                'restaurantTable',
                'reservationItems.menuItem',
            ]);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Update Reservation
    |--------------------------------------------------------------------------
    */

    public function updateReservation(
        Reservation $reservation,
        array $data
    ): Reservation {

        return DB::transaction(function () use ($reservation, $data) {

            // Lock the reservation being updated.
            $reservation = Reservation::whereKey($reservation->id)
                ->lockForUpdate()
                ->firstOrFail();

            /*
             * Update customer information when supplied.
             */

            if (
                array_key_exists('customer_name', $data) ||
                array_key_exists('contact_number', $data)
            ) {
                $customerName = $this->cleanText(
                    $data['customer_name']
                        ?? $reservation->customer->customer_name
                );

                $customerPhone = $this->cleanPhone(
                    $data['contact_number']
                        ?? $reservation->customer->contact_number
                );

                if ($customerName === '') {
                    throw ValidationException::withMessages([
                        'customer_name' => 'Please enter the customer name.',
                    ]);
                }

                if ($customerPhone === '') {
                    throw ValidationException::withMessages([
                        'contact_number' => 'Please enter the contact number.',
                    ]);
                }

                $customer = $this->findOrCreateCustomer(
                    $customerName,
                    $customerPhone
                );

                $reservation->customer_id = $customer->id;
            }

            /*
             * Update restaurant table.
             */

            $tableId = $this->positiveInteger(
                $data['restaurant_table_id']
                    ?? $reservation->restaurant_table_id,
                'restaurant_table_id'
            );

            $table = RestaurantTable::whereKey($tableId)
                ->lockForUpdate()
                ->firstOrFail();

            /*
             * Update party size.
             */

            $partySize = $this->positiveInteger(
                $data['party_size'] ?? $reservation->party_size,
                'party_size'
            );

            $this->checkCapacity($table, $partySize);

            /*
             * Update menu items when supplied.
             */

            if (array_key_exists('items', $data)) {

                $prepared = $this->prepareItems($data['items']);

                $total = $prepared['total'];

                $reservation->reservationItems()->delete();

                $reservation->reservationItems()->createMany(
                    $prepared['items']
                );

            } else {
                $total = (float) $reservation->total_amount;
            }

            /*
             * Update deposit.
             */

            $deposit = $this->money(
                $data['deposit_paid'] ?? $reservation->deposit_paid
            );

            $this->checkDeposit($deposit, $total);

            /*
             * Save reservation changes.
             */

            $reservation->restaurant_table_id = $table->id;
            $reservation->party_size = $partySize;
            $reservation->total_amount = $total;
            $reservation->deposit_paid = $deposit;

            if (isset($data['reservation_time'])) {
                $reservation->reservation_time = $data['reservation_time'];
            }

            $reservation->save();

            return $reservation->load([
                'customer',
                'restaurantTable',
                'reservationItems.menuItem',
            ]);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Restaurant Table
    |--------------------------------------------------------------------------
    */

    public function createRestaurantTable(array $data): RestaurantTable
    {
        $tableNumber = $this->cleanText(
            $data['table_number'] ?? ''
        );

        if ($tableNumber === '') {
            throw ValidationException::withMessages([
                'table_number' => 'Please enter a table number.',
            ]);
        }

        $tableData = [
            'table_number' => $tableNumber,
            'table_capacity' => $this->positiveInteger(
                $data['table_capacity'] ?? null,
                'table_capacity'
            ),
        ];

        return RestaurantTable::create($tableData);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Restaurant Table
    |--------------------------------------------------------------------------
    */

    public function updateRestaurantTable(
        RestaurantTable $table,
        array $data
    ): RestaurantTable {

        $tableData = [];

        if (array_key_exists('table_number', $data)) {

            $tableNumber = $this->cleanText(
                $data['table_number']
            );

            if ($tableNumber === '') {
                throw ValidationException::withMessages([
                    'table_number' => 'Please enter a table number.',
                ]);
            }

            $tableData['table_number'] = $tableNumber;
        }

        if (array_key_exists('table_capacity', $data)) {

            $tableData['table_capacity'] = $this->positiveInteger(
                $data['table_capacity'],
                'table_capacity'
            );
        }

        $table->update($tableData);

        return $table->refresh();
    }
}
