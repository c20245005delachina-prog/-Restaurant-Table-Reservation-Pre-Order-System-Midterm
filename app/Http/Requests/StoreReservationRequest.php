<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Sanitize input before validation.
     */
    protected function prepareForValidation(): void
    {
        $name = trim(strip_tags(
            (string) $this->input('customer_name', '')
        ));

        $this->merge([
            'customer_name' => mb_convert_case(
                $name,
                MB_CASE_TITLE,
                'UTF-8'
            ),

            'contact_number' => trim(strip_tags(
                (string) $this->input('contact_number', '')
            )),
        ]);
    }

    public function rules(): array
    {
        return [
            'customer_name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[\pL\pM\s.\'-]+$/u',
            ],

            'contact_number' => [
                'required',
                'string',
                'max:30',
                'regex:/^\+?[0-9\s\-()]+$/',
            ],

            'restaurant_table_id' => [
                'required',
                'integer',
                'exists:restaurant_tables,id',
            ],

            'reservation_time' => [
                'required',
                'date',
                'after_or_equal:today',
                'before_or_equal:2030-12-31',
            ],

            'party_size' => [
                'required',
                'integer',
                'min:1',
            ],

            'deposit_paid' => [
                'required',
                'numeric',
                'min:0',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.menu_item_id' => [
                'required',
                'integer',
                'exists:menu_items,id',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
                'max:1000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Customer name is required.',
            'customer_name.string' => 'Customer name must be valid text.',
            'customer_name.max' => 'Customer name must not exceed 255 characters.',
            'customer_name.regex' => 'Customer name may only contain letters, spaces, periods, apostrophes, and hyphens.',

            'contact_number.required' => 'Customer contact number is required.',
            'contact_number.string' => 'Contact number must be valid text.',
            'contact_number.max' => 'Contact number must not exceed 30 characters.',
            'contact_number.regex' => 'Please enter a valid contact number.',

            'restaurant_table_id.required' => 'Please select a restaurant table.',
            'restaurant_table_id.integer' => 'Please select a valid restaurant table.',
            'restaurant_table_id.exists' => 'The selected restaurant table does not exist.',

            'reservation_time.required' => 'Please select a reservation date and time.',
            'reservation_time.date' => 'Please enter a valid reservation date and time.',
            'reservation_time.after' => 'The reservation must be in the future.',

            'party_size.required' => 'Please enter the number of guests.',
            'party_size.integer' => 'The party size must be a whole number.',
            'party_size.min' => 'Party size must be at least one.',

            'deposit_paid.required' => 'Please enter the deposit amount.',
            'deposit_paid.numeric' => 'The deposit must be a valid amount.',
            'deposit_paid.min' => 'The deposit cannot be negative.',

            'items.required' => 'Add at least one pre-order item.',
            'items.array' => 'Pre-order items must be valid.',
            'items.min' => 'Add at least one pre-order item.',

            'items.*.menu_item_id.required' => 'Please select a menu item.',
            'items.*.menu_item_id.integer' => 'The selected menu item is invalid.',
            'items.*.menu_item_id.exists' => 'A selected menu item does not exist.',

            'items.*.quantity.required' => 'Please enter the quantity.',
            'items.*.quantity.integer' => 'Quantity must be a whole number.',
            'items.*.quantity.min' => 'Each quantity must be at least one.',
            'items.*.quantity.max' => 'Quantity cannot exceed 1000.',
        ];
    }
}
