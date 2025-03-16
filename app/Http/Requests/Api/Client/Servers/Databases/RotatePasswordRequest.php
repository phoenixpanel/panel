<?php

namespace Phoenixpanel\Http\Requests\Api\Client\Servers\Databases;

use Phoenixpanel\Models\Permission;
use Phoenixpanel\Http\Requests\Api\Client\ClientApiRequest;

class RotatePasswordRequest extends ClientApiRequest
{
    /**
     * Check that the user has permission to rotate the password.
     */
    public function permission(): string
    {
        return Permission::ACTION_DATABASE_UPDATE;
    }
}
