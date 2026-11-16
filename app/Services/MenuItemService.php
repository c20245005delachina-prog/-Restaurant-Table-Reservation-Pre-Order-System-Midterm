<?php

namespace App\Services;

use App\Models\MenuItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class MenuItemService
{
    public function paginate(
        ?string $search = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        return MenuItem::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function createMenuItem(array $data): MenuItem
    {
        return DB::transaction(function () use ($data) {
            return MenuItem::create([
                'name' => trim(strip_tags($data['name'])),
                'category' => trim(strip_tags($data['category'])),
                'price' => $data['price'],
            ]);
        });
    }

    public function updateMenuItem(
        array $data,
        int $id
    ): MenuItem {
        return DB::transaction(function () use ($data, $id) {
            $menuItem = MenuItem::findOrFail($id);

            $menuItem->update([
                'name' => trim(strip_tags($data['name'])),
                'category' => trim(strip_tags($data['category'])),
                'price' => $data['price'],
            ]);

            return $menuItem->refresh();
        });
    }

    public function deleteMenuItem(int $id): void
    {
        DB::transaction(function () use ($id) {
            $menuItem = MenuItem::findOrFail($id);

            $menuItem->delete();
        });
    }
}
