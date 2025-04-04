<?php

namespace PhoenixPanel\Http\Requests\Api\Client\Servers\Startup;

use PhoenixPanel\Models\Permission;
use PhoenixPanel\Http\Requests\Api\Client\ClientApiRequest;

class GetStartupRequest extends ClientApiRequest
{
    public function permission(): string
    {
        return Permission::ACTION_STARTUP_READ;
    }
}
