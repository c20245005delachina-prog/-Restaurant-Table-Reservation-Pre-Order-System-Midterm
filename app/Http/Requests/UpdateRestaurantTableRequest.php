<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRestaurantTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id')
            ?? $this->route('restaurant_table')
            ?? $this->route('restaurantTable');

        return [
            'table_number' => [
                'required',
                'string',
                'max:20',
                Rule::unique('restaurant_tables', 'table_number')->ignore($id),
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
            'table_number.unique' => 'That table number is already in use.',
            'table_capacity.min' => 'Capacity must be at least one person.',
        ];
    }
}