<?php

namespace PhoenixPanel\Http\Requests\Admin\Node;

use PhoenixPanel\Http\Requests\Admin\AdminFormRequest;

class AllocationFormRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'allocation_ip' => 'required|string',
            'allocation_alias' => 'sometimes|nullable|string|max:191',
            'allocation_ports' => 'required|array',
        ];
    }
}


