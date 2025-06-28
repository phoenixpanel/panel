<?php

namespace PhoenixPanel\Http\Requests\Api\Client\Servers\Network;

use PhoenixPanel\Models\Permission;
use PhoenixPanel\Http\Requests\Api\Client\ClientApiRequest;

class NewAllocationRequest extends ClientApiRequest
{
    public function permission(): string
    {
        return Permission::ACTION_ALLOCATION_CREATE;
    }
}


