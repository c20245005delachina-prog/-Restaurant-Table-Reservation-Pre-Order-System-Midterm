<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Services\CustomerService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(
        private CustomerService $service
    ) {}

    /**
     * Display all customers.
     */
    public function index(): Response
    {
        $customers = $this->service->paginate(
            request('search'),
            10
        );

        return Inertia::render('customers/index', [
            'customers' => $customers,
            'filters' => [
                'search' => request('search', ''),
            ],
        ]);
    }

    /**
     * Show the form for creating a customer.
     */
    public function create(): Response
    {
        return Inertia::render('customers/create');
    }

    /**
     * Store a newly created customer.
     */
    public function store(
        StoreCustomerRequest $request
    ): RedirectResponse {
        $this->service->createCustomer(
            $request->validated()
        );

        return to_route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    /**
     * Display a specific customer.
     */
    public function show(Customer $customer): Response
    {
        $customer->load('reservations');

        return Inertia::render('customers/show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Show the form for editing a customer.
     */
    public function edit(Customer $customer): Response
    {
        return Inertia::render('customers/edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update an existing customer.
     */
    public function update(
        UpdateCustomerRequest $request,
        Customer $customer
    ): RedirectResponse {
        $this->service->updateCustomer(
            $request->validated(),
            $customer->id
        );

        return to_route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    /**
     * Delete a customer.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        $this->service->deleteCustomer($customer->id);

        return to_route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}
