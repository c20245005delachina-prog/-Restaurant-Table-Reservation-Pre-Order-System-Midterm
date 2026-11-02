<?php

namespace App\Services;

use App\Models\RestaurantTable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RestaurantTableService
{
    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return RestaurantTable::query()
            ->latest()
            ->paginate($perPage);
    }

    public function createTable(array $data): RestaurantTable
    {
        return DB::transaction(function () use ($data) {
            return RestaurantTable::create([
                'table_number' => $data['table_number'],
                'table_capacity' => $data['table_capacity'],
            ]);
        });
    }

    public function updateTable(
        array $data,
        int $id
    ): RestaurantTable {
        return DB::transaction(function () use ($data, $id) {
            $table = RestaurantTable::findOrFail($id);

            $table->update([
                'table_number' => $data['table_number'],
                'table_capacity' => $data['table_capacity'],
            ]);

            return $table->refresh();
        });
    }

    public function deleteTable(int $id): void
    {
        $table = RestaurantTable::findOrFail($id);

        if ($table->reservations()->exists()) {
            throw ValidationException::withMessages([
                'table' => 'Cannot delete a table with existing reservations.',
            ]);
        }

        $table->delete();
    }
}
