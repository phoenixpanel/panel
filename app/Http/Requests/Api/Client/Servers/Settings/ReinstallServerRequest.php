<?php

namespace PheonixPanel\Http\Requests\Api\Client\Servers\Settings;

use PheonixPanel\Models\Permission;
use PheonixPanel\Http\Requests\Api\Client\ClientApiRequest;

class ReinstallServerRequest extends ClientApiRequest
{
    public function permission(): string
    {
        return Permission::ACTION_SETTINGS_REINSTALL;
    }
}
