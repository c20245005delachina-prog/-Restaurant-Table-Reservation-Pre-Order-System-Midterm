<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    /**
     * Display customers with search and pagination.
     */
    public function paginate(
        ?string $search = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        return Customer::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where(
                        'customer_name',
                        'like',
                        "%{$search}%"
                    )->orWhere(
                        'customer_number',
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
        return DB::transaction(function () use ($data) {
            return Customer::create([
                'customer_name' => trim(strip_tags($data['customer_name'])),
                'customer_number' => trim(strip_tags($data['customer_number'])),
            ]);
        });
    }

    /**
     * Update a customer.
     */
    public function updateCustomer(
        array $data,
        int $id
    ): Customer {
        return DB::transaction(function () use ($data, $id) {
            $customer = Customer::findOrFail($id);

            $customer->update([
                'customer_name' => trim(strip_tags($data['customer_name'])),
                'customer_number' => trim(strip_tags($data['customer_number'])),
            ]);

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