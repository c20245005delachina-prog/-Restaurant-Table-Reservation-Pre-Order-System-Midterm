<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
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
                'unique:customers,contact_number',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Please enter the customer name.',
            'customer_name.string' => 'The customer name must be valid text.',
            'customer_name.max' => 'The customer name must not exceed 255 characters.',
            'customer_name.regex' => 'The customer name may only contain letters, spaces, periods, apostrophes, and hyphens.',

            'contact_number.required' => 'Please enter the contact number.',
            'contact_number.string' => 'The contact number must be valid text.',
            'contact_number.max' => 'The contact number must not exceed 30 characters.',
            'contact_number.regex' => 'Please enter a valid contact number.',
            'contact_number.unique' => 'This contact number is already registered.',
        ];
    }
}
