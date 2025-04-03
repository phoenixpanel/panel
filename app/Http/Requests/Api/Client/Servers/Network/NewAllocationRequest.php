<?php

namespace PheonixPanel\Http\Requests\Api\Client\Servers\Network;

use PheonixPanel\Models\Permission;
use PheonixPanel\Http\Requests\Api\Client\ClientApiRequest;

class NewAllocationRequest extends ClientApiRequest
{
    public function permission(): string
    {
        return Permission::ACTION_ALLOCATION_CREATE;
    }
}
