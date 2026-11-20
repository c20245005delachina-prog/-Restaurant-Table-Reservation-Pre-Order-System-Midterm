<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    /**
     * Sanitize customer name.
     */
    private function sanitizeName(string $name): string
    {
        return trim(strip_tags($name));
    }

    /**
     * Sanitize contact number.
     * Keep only numbers and an optional leading plus sign.
     */
    private function sanitizeContactNumber(string $contactNumber): string
    {
        $contactNumber = trim(strip_tags($contactNumber));

        $contactNumber = preg_replace('/[^\d+]/', '', $contactNumber) ?? '';

        // Allow a plus sign only at the beginning.
        $contactNumber = preg_replace('/(?!^)\+/', '', $contactNumber) ?? '';

        return $contactNumber;
    }

    /**
     * Sanitize search input.
     */
    private function sanitizeSearch(?string $search): ?string
    {
        if ($search === null) {
            return null;
        }

        $search = trim(strip_tags($search));

        return $search !== '' ? $search : null;
    }

    /**
     * Display customers with search and pagination.
     */
    public function paginate(
        ?string $search = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        $search = $this->sanitizeSearch($search);

        return Customer::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where(
                        'customer_name',
                        'like',
                        "%{$search}%"
                    )->orWhere(
                        'contact_number',
                        'like',
                        "%{$search}%"
                    );
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create a customer.
     */
    public function createCustomer(array $data): Customer
    {
        $cleanData = [
            'customer_name' => $this->sanitizeName(
                (string) ($data['customer_name'] ?? '')
            ),
            'contact_number' => $this->sanitizeContactNumber(
                (string) ($data['contact_number'] ?? '')
            ),
        ];

        return DB::transaction(function () use ($cleanData) {
            return Customer::create($cleanData);
        });
    }

    /**
     * Update a customer.
     */
    public function updateCustomer(
        array $data,
        int $id
    ): Customer {
        $cleanData = [
            'customer_name' => $this->sanitizeName(
                (string) ($data['customer_name'] ?? '')
            ),
            'contact_number' => $this->sanitizeContactNumber(
                (string) ($data['contact_number'] ?? '')
            ),
        ];

        return DB::transaction(function () use ($cleanData, $id) {
            $customer = Customer::findOrFail($id);

            $customer->update($cleanData);

            return $customer->refresh();
        });
    }

    /**
     * Delete a customer.
     */
    public function deleteCustomer(int $id): void
    {
        DB::transaction(function () use ($id) {
            Customer::findOrFail($id)->delete();
        });
    }
}
