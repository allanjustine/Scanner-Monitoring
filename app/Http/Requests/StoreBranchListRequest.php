<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBranchListRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'branch_name' => ['required', 'min:1', 'max:255', 'string', Rule::unique('branch_lists', 'branch_name')],
            'branch_code' => ['required', 'min:1', 'max:255', 'string', Rule::unique('branch_lists', 'branch_code')],
        ];
    }
}
