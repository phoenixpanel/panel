<?php

namespace Phoenixpanel\Http\Requests\Admin\Node;

use Phoenixpanel\Http\Requests\Admin\AdminFormRequest;

class AllocationAliasFormRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'alias' => 'present|nullable|string',
            'allocation_id' => 'required|numeric|exists:allocations,id',
        ];
    }
}
