<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function paginate(
        ?string $search = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        return Customer::query()
            ->when($search, function ($query, $search) {
                $query->where('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_number', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function createCustomer(array $data): Customer
    {
        return DB::transaction(function () use ($data) {
            return Customer::create([
                'customer_name' => $data['customer_name'],
                'customer_number' => $data['customer_number'],
            ]);
        });
    }

    public function updateCustomer(
        array $data,
        int $id
    ): Customer {
        $customer = Customer::findOrFail($id);

        $customer->update([
            'customer_name' => $data['customer_name'],
            'customer_number' => $data['customer_number'],
        ]);

        return $customer->refresh();
    }

    public function deleteCustomer(int $id): void
    {
        Customer::findOrFail($id)->delete();
    }
}
