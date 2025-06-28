<?php

namespace PhoenixPanel\Http\Requests\Api\Client\Servers\Settings;

use PhoenixPanel\Models\Permission;
use PhoenixPanel\Http\Requests\Api\Client\ClientApiRequest;

class ReinstallServerRequest extends ClientApiRequest
{
    public function permission(): string
    {
        return Permission::ACTION_SETTINGS_REINSTALL;
    }
}


