<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'max:30'],
            'restaurant_table_id' => [
                'required', 'integer', 'exists:restaurant_tables,id',
            ],
            'reservation_time' => [
                'required', 'date', 'after:now',
            ],
            'party_size' => ['required', 'integer', 'min:1'],
            'deposit_paid' => ['required', 'numeric', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => [
                'required', 'integer', 'distinct', 'exists:menu_items,id',
            ],
            'items.*.quantity' => [
                'required', 'integer', 'min:1', 'max:1000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Customer name is required.',
            'contact_number.required' => 'Customer contact number is required.',
            'restaurant_table_id.exists' => 'Please select a valid restaurant table.',
            'reservation_time.after' => 'The reservation must be in the future.',
            'party_size.min' => 'Party size must be at least one.',
            'deposit_paid.min' => 'The deposit cannot be negative.',
            'items.required' => 'Add at least one pre-order item.',
            'items.*.menu_item_id.exists' => 'A selected menu item does not exist.',
            'items.*.quantity.min' => 'Each quantity must be at least one.',
        ];
    }
}