<?php

namespace App\Services;

use App\Models\MenuItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MenuItemService
{
    private const MAX_PRICE = 99999999.99;

    /**
     * Sanitize text by removing HTML tags,
     * trimming whitespace, and normalizing spaces.
     */
    private function sanitizeText(?string $value): string
    {
        $value = strip_tags($value ?? '');
        $value = trim($value);

        // Replace multiple spaces, tabs, and newlines with one space.
        return preg_replace('/\s+/', ' ', $value) ?? '';
    }

    /**
     * Sanitize and normalize the price.
     */
    private function sanitizePrice(mixed $value): string
    {
        if (
            !is_numeric($value) ||
            !is_finite((float) $value) ||
            (float) $value < 0 ||
            (float) $value > self::MAX_PRICE
        ) {
            throw ValidationException::withMessages([
                'price' => 'The price must be between ₱0.00 and ₱99,999,999.99.',
            ]);
        }

        // Store prices with exactly two decimal places.
        return number_format((float) $value, 2, '.', '');
    }

    /**
     * Sanitize all menu item input data.
     */
    private function sanitizeMenuItemData(array $data): array
    {
        $name = $this->sanitizeText($data['name'] ?? '');
        $category = $this->sanitizeText($data['category'] ?? '');

        if ($name === '') {
            throw ValidationException::withMessages([
                'name' => 'The menu item name is required.',
            ]);
        }

        if ($category === '') {
            throw ValidationException::withMessages([
                'category' => 'The menu item category is required.',
            ]);
        }

        return [
            'name' => $name,
            'category' => $category,
            'price' => $this->sanitizePrice($data['price'] ?? null),
        ];
    }

    /**
     * Display menu items with optional search.
     */
    public function paginate(
        ?string $search = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        $search = $search !== null
            ? $this->sanitizeText($search)
            : null;

        return MenuItem::query()
            ->when($search !== null && $search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create a new menu item.
     */
    public function createMenuItem(array $data): MenuItem
    {
        $cleanData = $this->sanitizeMenuItemData($data);

        return DB::transaction(function () use ($cleanData) {
            return MenuItem::create($cleanData);
        });
    }

    /**
     * Update an existing menu item.
     */
    public function updateMenuItem(
        array $data,
        int $id
    ): MenuItem {
        $cleanData = $this->sanitizeMenuItemData($data);

        return DB::transaction(function () use ($cleanData, $id) {
            $menuItem = MenuItem::findOrFail($id);

            $menuItem->update($cleanData);

            return $menuItem->refresh();
        });
    }

    /**
     * Delete a menu item.
     */
    public function deleteMenuItem(int $id): void
    {
        DB::transaction(function () use ($id) {
            $menuItem = MenuItem::findOrFail($id);

            $menuItem->delete();
        });
    }
}
