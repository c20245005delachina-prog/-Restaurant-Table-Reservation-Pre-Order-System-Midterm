<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerService
{
    /**
     * Sanitize customer name.
     */
    private function sanitizeName(string $name): string
    {
        $name = trim(strip_tags($name));

        return mb_convert_case($name, MB_CASE_TITLE, 'UTF-8');
    }

    /**
     * Sanitize contact number.
     */
    private function sanitizeContactNumber(string $contactNumber): string
    {
        $contactNumber = trim(strip_tags($contactNumber));

        // Preserve a leading plus sign and remove other unwanted characters.
        $hasLeadingPlus = str_starts_with($contactNumber, '+');

        $digits = preg_replace('/\D/', '', $contactNumber) ?? '';

        return ($hasLeadingPlus ? '+' : '').$digits;
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

        // Limit search input to avoid unnecessarily long queries.
        $search = mb_substr($search, 0, 100);

        return $search !== '' ? $search : null;
    }

    /**
     * Display customers with optimized search and pagination.
     */
    public function paginate(
        ?string $search = null,
        int $perPage = 10
    ): LengthAwarePaginator {

        $search = $this->sanitizeSearch($search);

        // Restrict pagination size to prevent excessive record retrieval.
        $perPage = max(1, min($perPage, 50));

        return Customer::query()

            // Retrieve only the columns required by the customer list.
            ->select([
                'id',
                'customer_name',
                'contact_number',
            ])

            // Apply search only when a search term is provided.
            ->when($search, function ($query) use ($search) {

                $query->where(function ($subQuery) use ($search) {

                    // Prefix searching can make better use of
                    // ordinary database indexes than %search%.
                    $subQuery->where(
                        'customer_name',
                        'like',
                        $search.'%'
                    )->orWhere(
                        'contact_number',
                        'like',
                        $search.'%'
                    );

                });

            })

            // Sort customers by newest record first.
            ->orderByDesc('id')

            // Retrieve records in controlled page sizes.
            ->paginate($perPage)

            // Preserve search parameters when navigating pages.
            ->withQueryString();
    }

    /**
     * Create a customer.
     */
    public function createCustomer(array $data): Customer
    {
        $data['customer_name'] = $this->sanitizeName(
            $data['customer_name']
        );

        $data['contact_number'] = $this->sanitizeContactNumber(
            $data['contact_number']
        );

        return Customer::create($data);
    }

    /**
     * Update a customer.
     */
    public function updateCustomer(array $data, int $id): Customer
    {
        $customer = Customer::findOrFail($id);

        // Sanitize only fields included in the update request.
        if (array_key_exists('customer_name', $data)) {
            $data['customer_name'] = $this->sanitizeName(
                $data['customer_name']
            );
        }

        if (array_key_exists('contact_number', $data)) {
            $data['contact_number'] = $this->sanitizeContactNumber(
                $data['contact_number']
            );
        }

        $customer->update($data);

        return $customer;
    }

    /**
     * Delete a customer.
     */
    public function deleteCustomer(int $id): void
    {
        // A transaction is unnecessary for a single delete operation.
        Customer::findOrFail($id)->delete();
    }
}
