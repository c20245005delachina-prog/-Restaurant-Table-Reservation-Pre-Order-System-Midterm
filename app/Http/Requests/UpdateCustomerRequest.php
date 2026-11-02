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
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_number' => [
                'required',
                'string',
                'max:30',
                Rule::unique('customers', 'customer_number')
                    ->ignore($customer),
            ],
        ];
    }
}