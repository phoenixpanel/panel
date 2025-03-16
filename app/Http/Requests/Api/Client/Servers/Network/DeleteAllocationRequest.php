<?php

namespace Phoenixpanel\Http\Requests\Api\Client\Servers\Network;

use Phoenixpanel\Models\Permission;
use Phoenixpanel\Http\Requests\Api\Client\ClientApiRequest;

class DeleteAllocationRequest extends ClientApiRequest
{
    public function permission(): string
    {
        return Permission::ACTION_ALLOCATION_DELETE;
    }
}
