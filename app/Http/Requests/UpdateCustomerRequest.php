<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customer = $this->route('customer');

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
                Rule::unique('customers', 'customer_number')
                    ->ignore($customer),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Please enter the customer name.',
            'customer_number.required' => 'Please enter the customer number.',
            'customer_number.unique' => 'This customer number is already registered.',
        ];
    }
}