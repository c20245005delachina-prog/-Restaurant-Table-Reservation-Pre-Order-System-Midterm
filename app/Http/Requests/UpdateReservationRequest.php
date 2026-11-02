<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['sometimes', 'required', 'string', 'max:255'],
            'contact_number' => ['sometimes', 'required', 'string', 'max:30'],
            'restaurant_table_id' => [
                'sometimes', 'required', 'integer', 'exists:restaurant_tables,id',
            ],
            'reservation_time' => ['sometimes', 'required', 'date', 'after:now'],
            'party_size' => ['sometimes', 'required', 'integer', 'min:1'],
            'deposit_paid' => ['sometimes', 'required', 'numeric', 'min:0'],
            'items' => ['sometimes', 'required', 'array', 'min:1'],
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
            'customer_name.required' => 'Customer name cannot be empty.',
            'contact_number.required' => 'Contact number cannot be empty.',
            'party_size.min' => 'Party size must be at least one.',
            'deposit_paid.min' => 'The deposit cannot be negative.',
            'items.min' => 'A reservation must have at least one pre-order item.',
        ];
    }
}