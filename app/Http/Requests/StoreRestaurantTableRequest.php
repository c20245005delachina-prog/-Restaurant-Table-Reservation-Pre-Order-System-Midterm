<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRestaurantTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'table_number' => [
                'required', 'string', 'max:20', 'unique:restaurant_tables,table_number',
            ],
            'table_capacity' => [
                'required', 'integer', 'min:1', 'max:65535',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'table_number.required' => 'Please enter a table number.',
            'table_number.unique' => 'This table number already exists.',
            'table_capacity.required' => 'Please enter the table capacity.',
            'table_capacity.min' => 'Table capacity must be at least one.',
        ];
    }
}