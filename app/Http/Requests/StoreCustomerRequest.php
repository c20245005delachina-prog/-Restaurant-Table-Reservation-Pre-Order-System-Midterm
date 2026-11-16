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
            ],

            'customer_number' => [
                'required',
                'string',
                'max:30',
                'unique:customers,customer_number',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Please enter the customer name.',
            'customer_name.max' => 'The customer name must not exceed 255 characters.',
            'customer_number.required' => 'Please enter the customer number.',
            'customer_number.unique' => 'This customer number is already registered.',
            'customer_number.max' => 'The customer number must not exceed 30 characters.',
        ];
    }
}