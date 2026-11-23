<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display all customers.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        return Inertia::render('customers/index', [
            'customers' => Customer::query()
                ->when($search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
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
     * Store a new customer.
     */
    public function store(
        StoreCustomerRequest $request
    ): RedirectResponse {
        Customer::create($request->validated());

        return to_route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    /**
     * Display a specific customer.
     */
    public function show(Customer $customer): Response
    {
        // OPTIMIZATION:
        // Uses nested eager loading to retrieve related reservations,
        // restaurant tables, reservation items, and menu items in batches.
        // Prevents N+1 queries and reduces unnecessary database requests.
        $customer->load([
            'reservations.restaurantTable',
            'reservations.reservationItems.menuItem',
        ]);

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
        $customer->update($request->validated());

        return to_route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    /**
     * Delete a customer.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();

        return to_route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}
